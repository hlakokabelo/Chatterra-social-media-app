import Linkify from "linkify-react";

import "linkify-plugin-mention";
import "linkify-plugin-hashtag";

interface FormatContentProps {
  content?: string;
}

// Formats content by turning URLs, mentions, and hashtags into interactive links.

export function FormatContent({ content }: FormatContentProps) {

  if(!content) return null;
  return (
    <Linkify
      options={{
        defaultProtocol: "https",

        render: {
          url: ({ attributes, content }) => (
            <a
              {...attributes}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {content}
            </a>
          ),

          email: ({ attributes, content }) => (
            <a
              {...attributes}
              className="text-blue-600 hover:underline"
            >
              {content}
            </a>
          ),

          mention: ({ content }) => {
            const username = String(content).slice(1);

            return (
              <a
                href={`/u/${encodeURIComponent(username)}`}
                className="text-blue-600 hover:underline"
              >
                {content}
              </a>
            );
          },

          hashtag: ({ content }) => {
            const hashtag = String(content).slice(1);

            return (
              <a
                href={`/search?q=${encodeURIComponent(`#${hashtag}`)}`}
                className="text-blue-600 hover:underline"
              >
                {content}
              </a>
            );
          },
        },
      }}
    >
      {content}
    </Linkify>
  );
}