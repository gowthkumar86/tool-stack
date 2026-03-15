import { Helmet } from "react-helmet-async";

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Helmet>
        <title>Contact – ToolStack</title>
        <meta
          name="description"
          content="Contact ToolStack for feedback, suggestions, bug reports, or tool requests."
        />
      </Helmet>

      <h1 className="text-3xl font-bold">Contact Us</h1>

      <p>
        If you have feedback, suggestions, tool requests, or if you found a
        problem while using one of our tools, we would love to hear from you.
      </p>

      <p>
        ToolStack is continuously improving and your suggestions help us
        build better tools for everyone.
      </p>

      <h2 className="text-xl font-semibold">Email</h2>

      <p className="text-muted-foreground">
        You can contact us at: 
        <a href="mailto:gowthkumar86backup@gmail.com">
        <b> gowthkumar86backup@gmail.com</b>
        </a>
      </p>

      <p className="text-sm text-muted-foreground">
        We usually respond within 48 hours.
      </p>
    </div>
  );
}