"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressIndicator from "./ProgressIndicator";
import SystemSelector from "./SystemSelector";
// import IntegrationTypeSelector from "./IntegrationTypeSelector";
// import ConnectionConfiguration from "./ConnectionConfiguration";
// import ConnectionVerification from "./ConnectionVerification";

export const IntegrationSetupForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [integrationSystem, setIntegrationSystem] = useState("");
  // const [selectedIntegrationType, setSelectedIntegrationType] = useState("api");
  // const [testingConnection, setTestingConnection] = useState(false);
  // const [testConnectionSuccess, setTestConnectionSuccess] = useState(false);

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // const handlePreviousStep = () => {
  //   setCurrentStep(currentStep - 1);
  // };

  // const handleTestConnection = () => {
  //   setTestingConnection(true);
  //   // Simulate a connection test
  //   setTimeout(() => {
  //     setTestingConnection(false);
  //     setTestConnectionSuccess(true);
  //   }, 2000);
  // };

  // const handleFinish = () => {
  //   router.push("/");
  // };

  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Integration Setup
        </h1>
        <p className="text-gray-500">
          Connect your hospital supply management system to unlock Tier 3
          features including AI Agent, Predictive Analytics, and Supply
          Exchange.
        </p>
      </div>

      <ProgressIndicator currentStep={currentStep} />

      {currentStep === 1 && (
        <SystemSelector
          integrationSystem={integrationSystem}
          setIntegrationSystem={setIntegrationSystem}
          onCancel={() => router.push("/")}
          onNext={handleNextStep}
        />
      )}

      {/* {currentStep === 2 && (
        <IntegrationTypeSelector
          selectedIntegrationType={selectedIntegrationType}
          setSelectedIntegrationType={setSelectedIntegrationType}
          onBack={handlePreviousStep}
          onNext={handleNextStep}
        />
      )}

      {currentStep === 3 && (
        <ConnectionConfiguration
          integrationType={selectedIntegrationType}
          onBack={handlePreviousStep}
          onNext={handleNextStep}
        />
      )}

      {currentStep === 4 && (
        <ConnectionVerification
          integrationSystem={integrationSystem}
          integrationType={selectedIntegrationType}
          testingConnection={testingConnection}
          testConnectionSuccess={testConnectionSuccess}
          onTestConnection={handleTestConnection}
          onBack={handlePreviousStep}
          onFinish={handleFinish}
        /> 
      )}*/}
    </div>
  );
};

export default IntegrationSetupForm;
