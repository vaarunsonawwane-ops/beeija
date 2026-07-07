import type { ReactNode } from "react";

type BeeijaYellowLineListProps = {
  items: ReactNode[];
  className?: string;
};

type BeeijaQuestion = {
  question: string;
  answer: ReactNode;
};

type BeeijaQuestionListProps = {
  questions: BeeijaQuestion[];
  className?: string;
};

export function BeeijaYellowLineList({
  items,
  className = "",
}: BeeijaYellowLineListProps) {
  return (
    <ul className={`beeija-yellow-line-list ${className}`}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export function BeeijaQuestionList({
  questions,
  className = "",
}: BeeijaQuestionListProps) {
  return (
    <div className={`beeija-question-list ${className}`}>
      {questions.map((item) => (
        <div key={item.question}>
          <h3 className="beeija-question-title">{item.question}</h3>
          <div className="beeija-question-answer">{item.answer}</div>
        </div>
      ))}
    </div>
  );
}
