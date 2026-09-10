import React from "react";


// used to highlight texts from a search result
function HighlightMatch({
  text,
  query,
}: {
  text?: string;
  query: string;
}) {

  if(!text)return null;
  if (!query.trim()) {
    return <>{text}</>;
  }

  const regex = new RegExp(
    `(${escapeRegExp(query)})`,
    "gi"
  );

  return (
    <>
      {text.split(regex).map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="bg-yellow-200">
            {part}
          </mark>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default HighlightMatch;
