import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import PDF from "../images/pdf.svg"
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Link } from 'react-router-dom'
// import UserAPI from "../../../api/UserAPI";


import "./status.css";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


export default function OrderedProdModal({
  setOpenModal,
  products,
  address,
  openModal,
  additional
  // order,



}) {
  const onCloseModal = () => {
    setOpenModal(false);
  };
  // const state = useContext(GlobalState);

  // const [token] = state.token;
  // const userState = UserAPI(token);
  // const [order] = userState.order;
  
  const generatePdf = (products) => {
    var docDefinition = {
      pageSize: "A5",
      content: [
        {
          text: "Athaana",
          fontSize: 16,
          alignment: "right",
          color: "#ff0000",


        },
        {
          text: "Address:Nalabri,khat", fontSize: 8, alignment: "right",
        },
        { text: "Phone:9101313393/6000589690", fontSize: 8, alignment: "right", },
        { text: "Email:athaana.inc@gmail.com", fontSize: 8, alignment: "right", },
        


        {
          text: "Order Details",
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 10],

        },

        {
          text: `Order Id: ${additional.id}`,
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          fontSize: 10,
          width: "40%",


          // layout: "lightHorizontalLines",
        },
        {
          text: `Order Date: ${DisplayLocalDate(additional.date)}`, fontSize: 9,
        },

        { text: `Name: ${address.name}`, fontSize: 8 },
        { text: `Number: ${address.number}`, fontSize: 8 },
        { text: `Address: ${address.address}`, fontSize: 8 },
        { text: `City: ${address.city}`, fontSize: 8 },
        { text: `Pincode: ${address.pincode}`, fontSize: 8 },
        {text: `Order Status:${additional.status}`, fontSize: 8, bold: true},


        {
          text: `Total: ${additional.netPayable}`,
          fontSize: 10,
          bold: true,
          margin: [0, 0, 10, 20],
          alignment: "left"
        },

      ],
    };





    // console.log(docDefinition);
    products?.map((product) => {
      const productDetails = [

        [
          {
            text: `Product : ${product.product.title}`,
            fontSize: 9,
            bold: true,
            alignment: "left",
            margin: [10, 0, 0, 0],


          },
          {
            text: `Qty: ${product.quantity}`, fontSize: 8, alignment: "right", margin: [0, 0, 10, 0],
          },
          {
            text: `Rs: ${product.product.price}`, fontSize: 8, alignment: "right", margin: [0, 0, 10, 0],
          },
          {
            text: `                  Rs: ${product.product.price * product.quantity}`, alignment: "right", margin: [0, 0, 10, 5],
            fontSize: 9,
            bold: true,
            italics: true,
            decoration: "overline",
            background: "#ccc",
          },
        ],
      ];
      docDefinition.content.push(...productDetails);


    });
    docDefinition.content.push({
      text: `Total: ${additional.netPayable}`,
      fontSize: 12,
      bold: true,
      margin: [0, 5, 10, 5],
      alignment: "right"

    })
    docDefinition.content.push({
      text: `Shipping Charge: ${additional.shippingPrice}`,
      fontSize: 8,
      bold: true,
      margin: [0, 0, 10, 5],
      alignment: "right",
    })
    docDefinition.content.push({
      text: `${additional.offer}`,
      fontSize: 8,
      bold: true,
      margin: [0, 0, 10, 5],
      alignment: "right",
    })



    docDefinition.content.push(
      {
        text: "THANKYOU",
        alignment: "center",
        fontSize: 12,
        bold: true,
        margin: [0, 15, 0, 0],
        color: "dimgrey",
        characterSpacing: 5,
      }
    );
    docDefinition.content.push(
      {
        text: "Visit Again",
        alignment: "center",
        fontSize: 10,
        bold: true,
        margin: [0, 15, 0, 0],
        color: "dimgrey",
      },
    );

    pdfMake.createPdf(docDefinition).download('recipe');
    

    



  }
  function DisplayLocalDate(date){
    let localDate = new Date(date).toLocaleDateString();
    return localDate.split(",")[0].replaceAll('/','-')
  }
  



  
  return (
    <div>
      <Modal open={openModal} onClose={onCloseModal}>
        <h4>Ordered Products</h4>

        {/* products details  */}
        <div className="ordered_prod_container">
          {products?.map((product) => (
           
            <div className="ordered_prod" key={product._id} >
              <div className="ordered_prod">
              <Link to={`/detail/${product.product._id}/${product.product.category}`}>
                <img
                  style={{
                    height: "80px",
                    width: "80px",
                    borderRadius: "5px",
                    textAlign: "left",
                    marginRight: "10px",


                  }}
                  src={product.product.images.url}
                  alt=""
                />
                </Link>
                <div style={{ fontWeight: "400" }}>


                  Quantity : <span>{product.quantity}</span>
                  <br />
                  Name : <span >{product.product.title}</span>
                  <br />
                  Price : Rs <span>{product.product.price}</span>
                  <br />
                  Description :<span>{product.product.description}</span>

                  <br />



                </div>
              </div>



            </div>


          ))}

          <div >

            <div style={{ fontWeight: "400" }}>
            <span style={{fontWeight:'bold'}}>
              Amount To be Paid: Rs <span>{additional.netPayable}</span>
               </span>
               <br />
              Shipping Price: Rs <span>{additional.shippingPrice}</span>
              
             
             
               <br />
              <span>{additional.offer}</span>
            </div>



            <br />
            <div style={{ fontWeight: "400" }}>
              Name:<span>{address.name}</span>
              <br />
              Address : <span>{address.address}</span>
              <br />
              Phone : <span>{address.number}</span>
              <br />
              City : <span>{address.city}</span>
              <br />
              Pincode : <span>{address.pincode}</span>
              {address.landmark && <p>Landmark : <span>{address.landmark}</span></p>}
              {address.alternate && <p>Alt Phone  : <span>{address.alternate}</span></p>}
            </div>
            <button className="pdfdownload" onClick={()=>generatePdf(products)} style={{border:"1px solid black",  borderRadius: "5px", padding: "0 5px 5px 5px", height: '2rem', marginTop: '5px',color:"black", }}>
             Download as PDF
                  <img src={PDF} alt="" style={{ height: "20px", width: "20px",marginLeft:'5px',position:'relative',top:'3px'}} />
                 
            </button>
          </div>
        </div>



      </Modal>
    </div>
  )


}







