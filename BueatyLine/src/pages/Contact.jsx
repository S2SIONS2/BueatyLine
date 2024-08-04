import './Contact.scss'
import ContactList from '../components/ContactList';

const Contact = () => {
    return (
        <div className='Contact'>
            <div className='subTitle'>Contact List</div>
            <section>
                <ContactList/>
            </section>


        </div>
    );
};

export default Contact;

