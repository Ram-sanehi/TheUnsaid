import { partTitles } from "../data/chapters";

interface PartDividerProps {
  partNumber: number;
  partTitle: string;
  openingQuote?: string;
}

const partQuotes: Record<number, string> = {
  1: "Some people do not enter your life. They simply arrive, like rain you didn't expect.",
  2: "The highest form of love is not possession. It is protection.",
  3: "Words that rearrange the air around them.",
  4: "Gratitude and grief are not opposites. They are neighbours.",
};

export function PartDivider({ partNumber, partTitle, openingQuote }: PartDividerProps) {
  const quote = openingQuote || partQuotes[partNumber] || "";

  return (
    <div className="part-divider">
      <p className="part-divider__number">{partTitles[partNumber] || `Part ${partNumber}`}</p>
      <h2 className="part-divider__title">{partTitle}</h2>
      <hr />
      {quote && <p className="part-divider__quote">"{quote}"</p>}
    </div>
  );
}
