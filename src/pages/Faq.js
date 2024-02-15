import React, { useState } from 'react';
import './faqStyles.css'; // Assuming this file contains the styles you've shared

const FaqItem = ({ faq, toggleFAQ }) => {
    return (
        <div className={`faq ${faq.open ? 'open' : ''}`} onClick={toggleFAQ}>
            <div className="faq-question">{faq.question}</div>
            <div className="faq-answer">{faq.answer}</div>
        </div>
    );
};

const Faq = () => {
    const [faqs, setFaqs] = useState([
        {
            question: "I'm new here and need a crash course on TrypSync, where can I find one?",
            answer: "Go to our homepage and click the 'Demo' button for the basics, it's right under the 'Get Started' Button.",
            open: false
        },
        {
            question: "How do I ride with TrypSync?",
            answer: "The first step is to enter your search information (location, destination, ride date, ride times) in the 'Search Tryps' section to see if any other student(s) have already created a Tryp that you can join. If not, click 'Create New Tryp' and enter your Tryp information. If your Tryp creation was successful, you should be able to see it in the 'My Tryps' section. If someone joins your Tryp, you will be notified through text message.",
            open: false
        },
        {
            question: "How does TrypSync ensure that my personal information (my name and telephone number) is not available to the public?",
            answer: "Because of our robust @.edu email authentication system, we ensure that only students from your college or university will be able to create an account or login to our platform.",
            open: false
        },
        {
            question: "What happens when I Join a Tryp?",
            answer: "When you Join a Tryp after searching and finding a Tryp with your desired date, time, and destination, the host and any other riders will be notified through text that someone has joined the Tryp.",
            open: false
        },
        {
            question: "What happens when I Leave a Tryp?",
            answer: "When you leave a Tryp, the number of seats remaining is incremented by one and all other riders will be notified that someone left the Tryp. If you were the Tryp Host, another rider will randomly be assigned new Host. If you were the last rider in the Tryp, the Tryp is deleted.",
            open: false
        },
        {
            question: "Who can edit number of seats available in a Tryp?",
            answer: "Only the Tryp Host can increase or decrease the seats available in any particular Tryp.",
            open: false
        }
    ]);

    const toggleFAQ = index => {
        setFaqs(faqs.map((faq, i) => {
            if (i === index) {
                faq.open = !faq.open;
            } else {
                faq.open = false;
            }
            return {...faq};
        }));
    };

    return (
        <>
            <header>
                <h1>TrypSync FAQs and Best Practices</h1>
            </header>
            <div className="faqs">
                {faqs.map((faq, index) => (
                    <FaqItem key={index} faq={faq} toggleFAQ={() => toggleFAQ(index)} />
                ))}
            </div>
        </>
    );
};

export default Faq;
