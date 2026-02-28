import Head from 'next/head';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Find The Babies - Hope for Families</title>
        <meta name="description" content="Dedicated to assisting in the search for missing children and adults across the globe." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">
          Find The Babies
        </h1>

        <p className="description">
          Bringing hope and answers to families worldwide.
        </p>

        <section className="section">
          <h2>Our Mission</h2>
          <p>Dedicated to assisting in the search for missing children and adults across the globe. We believe every missing person deserves to be found, and every family deserves answers. This platform serves as a central hub for information, resources, and community support in critical search efforts.</p>
        </section>

        <section className="section">
          <h2>Current Cases</h2>
          <p><em>(This section will be dynamically updated with profiles of missing individuals and relevant details, often integrated with a backend database like Firebase.)</em></p>
          <p>Here, you will find information on individuals who are currently missing, including their last known whereabouts, descriptions, and contact information for reporting leads. Your vigilance can make a difference.</p>
        </section>

        <section className="section">
          <h2>How You Can Help</h2>
          <ul>
            <li><strong>Share Information:</strong> Spread awareness about missing persons cases on social media and within your networks.</li>
            <li><strong>Volunteer:</strong> Offer your time and skills to search efforts or administrative tasks (details to be provided).</li>
            <li><strong>Donate:</strong> Support our operational costs and efforts to reach more families.</li>
            <li><strong>Report Leads:</strong> If you have any information, no matter how small, please contact the relevant authorities or our team (contact details below).</li>
          </ul>
        </section>

        <section className="section">
          <h2>Contact Us</h2>
          <p>For urgent matters or to report a lead, please use the contact information provided on specific case pages or reach out to us:</p>
          <p>Email: <a href="mailto:info@findthemissing.org">info@findthemissing.org</a> (Placeholder)</p>
          <p>Phone: (123) 456-7890 (Placeholder)</p>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2026 Find The Babies. All rights reserved.</p>
      </footer>
    </div>
  );
}