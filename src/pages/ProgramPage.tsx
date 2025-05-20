
import React from "react";
import PageContainer from "@/components/layout/PageContainer";
import { useProgram } from "@/hooks/use-program";
import ProgramLoading from "@/components/program/ProgramLoading";
import EmptyProgramState from "@/components/program/EmptyProgramState";
import ProgramContent from "@/components/program/ProgramContent";

const ProgramPage = () => {
  const { program, isLoading, isGenerating, generateProgram } = useProgram();

  const renderContent = () => {
    if (isLoading) {
      return <ProgramLoading />;
    }

    if (!program) {
      return (
        <EmptyProgramState 
          isGenerating={isGenerating} 
          onGenerate={generateProgram} 
        />
      );
    }

    return (
      <ProgramContent 
        program={program} 
        isGenerating={isGenerating} 
        onGenerateNew={generateProgram}
      />
    );
  };

  return (
    <PageContainer title="Training Program">
      {renderContent()}
    </PageContainer>
  );
};

export default ProgramPage;
