import './Contact.scss'
import ContactList from '../components/ContactList';

const Contact = () => {
    //안드로이드 앱에서 전화번호 가져옴
    const checkOS = () => {
        const isMobile = /iPhone|Android/i.test(navigator.userAgent);
        if (isMobile) {
          if (!window.confirm("동기화를 진행하시겠습니까? \n 동일한 전화번호가 존재할 경우, 휴대폰의 정보로 갱신됩니다.")) return;
          if (typeof window.Android !== 'undefined') {
            window.Android.syncPhoneBook();
          }
        } else {
          alert('앱에서 실행해주세요');
        }
      };

    return (
        <div className='Contact'>
            <div className='subTitle'>Contact List</div>
            <button className='w-100 mb-3' type="button" onClick={checkOS}>전화번호 동기화</button>
            <section>
                <ContactList/>
            </section>


        </div>
    );
};

export default Contact;

