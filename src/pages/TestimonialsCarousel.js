import React from "react";
import {
  MDBCarousel,
  MDBCarouselItem,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";


export default function TestimonialsCarousel() {
  return (
    <MDBContainer className="my-5">
      <MDBCarousel showControls dark>
          <MDBCarouselItem className="active text-center">
            <MDBRow className="d-flex justify-content-center">
              <MDBCol lg="8">
                <h3 className="mb-3">Jay M.</h3>
                <p>Student</p>
                <p className="text-muted">
                  <MDBIcon fas icon="quote-left" className="pe-2" />
                  The cost savings with TrypSync are remarkable. I've significantly cut down on my Uber expenses, and it's so simple to use. It is both economical and efficient to use.
                </p>
              </MDBCol>
            </MDBRow>
            <ul className="list-unstyled d-flex justify-content-center text-warning mb-0">
              <li>
                <MDBIcon fas icon="star" size="sm" />
              </li>
              <li>
                <MDBIcon fas icon="star" size="sm" />
              </li>
              <li>
                <MDBIcon fas icon="star" size="sm" />
              </li>
              <li>
                <MDBIcon fas icon="star" size="sm" />
              </li>
              <li>
                <MDBIcon fas icon="star" size="sm" />
              </li>
            </ul>
          </MDBCarouselItem>

          <MDBCarouselItem className="text-center">
            <MDBRow className="d-flex justify-content-center">
              <MDBCol lg="8">
                <h3 className="mb-3">Katie H.</h3>
                <p>Student</p>
                <p className="text-muted">
                  <MDBIcon fas icon="quote-left" className="pe-2" />
                  I love the TrypSync service! It has made my traveling much more convenient and cost-effective. The website is user-friendly, and I've had great experiences sharing rides with friendly people. Highly recommend it!
                </p>
              </MDBCol>
            </MDBRow>
            <ul className="list-unstyled d-flex justify-content-center text-warning mb-0">
              <li>
                <MDBIcon fas icon="star" size="sm" />
              </li>
              <li>
                <MDBIcon fas icon="star" size="sm" />
              </li>
              <li>
                <MDBIcon fas icon="star" size="sm" />
              </li>
              <li>
                <MDBIcon fas icon="star" size="sm" />
              </li>
              <li>
                <MDBIcon fas icon="star" size="sm" />
              </li>
            </ul>
          </MDBCarouselItem>

          <MDBCarouselItem className="text-center">
            <MDBRow className="d-flex justify-content-center">
              <MDBCol lg="8">
                <h3 className="mb-3">Samai S.</h3>
                <p>Student</p>
                <p className="text-muted">
                  <MDBIcon fas icon="quote-left" className="pe-2" />
                  When I was coming back from New York, I needed a ride quickly. I hopped on RSF and I was connected with someone in less than 10 minutes and shared an Uber back to campus. Thanks to RSF, I was able to save 30+ dollars!
                </p>
              </MDBCol>
            </MDBRow>
            <ul className="list-unstyled d-flex justify-content-center text-warning mb-0">
              <li>
                <MDBIcon fas icon="star" size="sm" />
              </li>
              <li>
                <MDBIcon fas icon="star" size="sm" />
              </li>
              <li>
                <MDBIcon fas icon="star" size="sm" />
              </li>
              <li>
                <MDBIcon fas icon="star" size="sm" />
              </li>
              <li>
                <MDBIcon fas icon="star" size="sm" />
              </li>
            </ul>
          </MDBCarouselItem>
      </MDBCarousel>
    </MDBContainer>
  );
}