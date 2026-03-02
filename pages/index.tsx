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
        <div className="hero">
          <h1>Find The Babies</h1>
          <p>A dedicated platform committed to uncovering the truth and reuniting families. We tirelessly work to locate missing individuals, providing a beacon of hope and a hub for critical information and community support. Every search brings us closer to answers.</p>
          <a href="#how-you-can-help" className="button">How You Can Help</a>
        </div>

        <section className="section">
          <h2>Our Mission</h2>
          <p>Dedicated to assisting in the search for missing children and adults across the globe. We believe every missing person deserves to be found, and every family deserves answers. This platform serves as a central hub for information, resources, and community support in critical search efforts.</p>
        </section>

        <section className="section">
          <h2>Current Cases</h2>
          <p><strong>Note:</strong> This section serves as a placeholder for demonstrating the site's structure in an offline, local environment. In a live deployment, it would be dynamically updated with profiles of missing individuals and relevant details from a backend.</p>
          <p>Here, you would typically find information on individuals who are currently missing, including their last known whereabouts, descriptions, and contact information for reporting leads. Your vigilance can make a difference.</p>
        </section>

        <section className="section" id="how-you-can-help">
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
          <p>Email: <a href="mailto:info@findthebabies.org">info@findthebabies.org</a> (Placeholder)</p>
          <p>Phone: (123) 456-7890 (Placeholder)</p>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2026 Find The Babies. All rights reserved.</p>
      </footer>
    </div>
  );
}
