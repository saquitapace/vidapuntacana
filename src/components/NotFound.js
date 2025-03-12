import Layout from '@/src/layouts/Layout';
import Link from 'next/link';
import '../styles/error-page.css';
const NotFound = () => {
  return (
    <Layout>
      <section className="error-page-section pt-120 pb-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="error-content text-center wow fadeInUp">
                <div className="error-thumb mb-45">
                  <img src="/assets/images/404.png" alt="404 Image" />
                </div>
                <h2>Oops! Listing Not Found</h2>
                <p>
                  The listing you are looking for might have been removed, had its
                  name changed, or is temporarily unavailable.
                </p>
                <div className="error-button mt-30">
                  <Link href="/" className="main-btn icon-btn">
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound; 