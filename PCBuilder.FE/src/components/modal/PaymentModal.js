import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/esm/Button'
const PaymentModal = ({closeModel}) => {
    return (
        <div className='modalBackground'>
            <div className='modelContainer'>
                <Row className='closebtn'>
                    <div className='mb-3 title'>
                        <h1>PayMent Details</h1>
                        <button onClick = {() => {closeModel(false)}}>X</button>
                    </div>
                    <button className='mb-3' onClick = {() => {closeModel(false)}}>X</button>
                </Row>
               
            <Row>
                <Col>
                    <img src='' alt = 'paypal'/>
                </Col>
                <Col className='footer'>
                    <Button>Pay Now</Button>
                    <Button id='canceBtn'onClick = {() => {closeModel(false)}}>Cancel</Button>
                </Col>  

            </Row>             
             
        </div>
    </div>   
    )
}
export default PaymentModal