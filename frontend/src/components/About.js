import React from 'react';
import {useDocumentTitle} from "./utils/useDocumentTitle";

function About() {
    useDocumentTitle('Athena • What is Athena?');
  return (
    <div className="p-6 max-w-3xl mx-auto text-center">

      <h1 className="text-3xl font-bold mb-4">About Athena</h1>
      <p className="text-lg">
        Athena is a GitHub analytics dashboard that provides insights into a user's repositories,
        languages used, and highlights top repositories by activity and stars.
      </p>
    </div>
  );
}

export default About;

