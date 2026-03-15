import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Helmet>
        <title>Privacy Policy – ToolStack</title>
        <meta
          name="description"
          content="Privacy policy explaining how ToolStack collects, uses, and protects user information."
        />
      </Helmet>

      <h1 className="text-3xl font-bold">Privacy Policy</h1>

      <p>
        At ToolStack, accessible from this website, one of our main priorities
        is the privacy of our visitors. This Privacy Policy document contains
        types of information that are collected and recorded by ToolStack and
        how we use it.
      </p>

      <h2 className="text-xl font-semibold">Information We Collect</h2>
      <p>
        Most tools on ToolStack run directly in your browser. We do not store
        the information you enter into the tools unless explicitly stated.
      </p>
      <p>
        However, we may collect certain non-personal information automatically,
        including:
      </p>
      <ul className="list-disc ml-6">
        <li>Browser type</li>
        <li>Device information</li>
        <li>Pages visited</li>
        <li>Time and date of visits</li>
        <li>Referring website</li>
      </ul>

      <h2 className="text-xl font-semibold">Cookies</h2>
      <p>
        ToolStack uses cookies to store information about visitors’
        preferences and optimize the user experience by customizing web page
        content based on visitors’ browser type or other information.
      </p>

      <h2 className="text-xl font-semibold">Google AdSense</h2>
      <p>
        We use Google AdSense to display advertisements on our website.
        Google may use cookies and web beacons to collect data about users
        in order to serve personalized advertisements.
      </p>

      <p>
        Google’s use of the DoubleClick cookie enables it and its partners
        to serve ads to users based on their visit to this website and other
        websites on the Internet.
      </p>

      <p>
        Users may opt out of personalized advertising by visiting the
        Google Ads Settings page:
        https://adssettings.google.com/
      </p>

      <h2 className="text-xl font-semibold">Third-Party Privacy Policies</h2>
      <p>
        ToolStack's Privacy Policy does not apply to other advertisers or
        websites. Thus, we advise you to consult the respective Privacy
        Policies of these third-party ad servers for more detailed information.
      </p>

      <h2 className="text-xl font-semibold">Children's Information</h2>
      <p>
        Protecting children while using the internet is important to us.
        ToolStack does not knowingly collect any Personal Identifiable
        Information from children under the age of 13.
      </p>

      <h2 className="text-xl font-semibold">Consent</h2>
      <p>
        By using our website, you hereby consent to our Privacy Policy
        and agree to its terms.
      </p>

      <h2 className="text-xl font-semibold">Updates</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes
        will be posted on this page.
      </p>

      <h2 className="text-xl font-semibold">Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, you can contact
        us through the contact page of this website.
      </p>
    </div>
  );
}