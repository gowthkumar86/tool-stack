import { Helmet } from "react-helmet-async";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Helmet>
        <title>About – ToolStack</title>
        <meta
          name="description"
          content="Learn about ToolStack, a free platform offering online calculators and utility tools that work instantly in your browser."
        />
      </Helmet>

      <h1 className="text-3xl font-bold">About ToolStack</h1>

      <p className="text-muted-foreground">
        ToolStack is a free online platform that provides useful calculators
        and utility tools designed to simplify everyday tasks. Our goal is to
        make common calculations and digital utilities easily accessible to
        everyone.
      </p>

      <p className="text-muted-foreground">
        ToolStack provides free online calculators, developer utilities, text tools, and converters that work instantly in your browser.
      </p>
      
      <p className="text-muted-foreground">
        All tools on ToolStack are designed to be fast, simple, and easy to use.
        Most tools run directly in your browser, meaning you don’t need to
        download any software or create an account to use them.
      </p>

      <h2 className="text-xl font-semibold">What We Offer</h2>

      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
        <li>Finance calculators</li>
        <li>Developer tools</li>
        <li>Text utilities</li>
        <li>Unit converters</li>
        <li>Health calculators</li>
        <li>Date and time tools</li>
      </ul>

      <h2 className="text-xl font-semibold">Our Mission</h2>

      <p className="text-muted-foreground">
        Our mission is to build a growing collection of practical tools that
        help people save time and solve everyday problems quickly.
      </p>

      <p className="text-muted-foreground">
        We continuously improve ToolStack by adding new tools and refining
        existing ones based on user needs and feedback.
      </p>
    </div>
  );
}