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
            answer: "Go to our Home page and click the 'Demo' button for the basics, its right under the 'Get Started' Button.",
            open: false
        },
        {
            question: "What happens if I leave a Tryp?",
            answer: "If you leave a tryp, the number of seats remaining goes up by one and another rider is assigned to become the new host. If you were the last rider in the Tryp, the Tryp is deleted.",
            open: false
        },
        {
            question: "Who can edit number of seats available in a Tryp?",
            answer: "Only the host has the ability to increase or decrease the seats available in a particular tryp.",
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
