import {
  Mail,
  MessageSquare,
} from "lucide-react";

type CustomerMessagesProps = {
  messages: unknown[];
};

export function CustomerMessages({
  messages,
}: CustomerMessagesProps) {
  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-5">
        <div>
          <h2 className="font-semibold">
            Contact messages
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Messages submitted by this customer.
          </p>
        </div>

        <MessageSquare className="h-5 w-5 text-muted-foreground" />
      </div>

      {messages.length === 0 ? (
        <div className="p-10 text-center">
          <Mail className="mx-auto h-8 w-8 text-muted-foreground/50" />

          <p className="mt-3 text-sm text-muted-foreground">
            No contact messages.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {messages.map(
            (message, index) => {
              const item =
                typeof message ===
                  "object" &&
                message !== null
                  ? (message as Record<
                      string,
                      unknown
                    >)
                  : {};

              const subject =
                typeof item.subject ===
                "string"
                  ? item.subject
                  : "Contact message";

              const body =
                typeof item.message ===
                "string"
                  ? item.message
                  : typeof item.content ===
                      "string"
                    ? item.content
                    : "No message content available.";

              return (
                <div
                  key={
                    typeof item.id ===
                    "string"
                      ? item.id
                      : index
                  }
                  className="p-5"
                >
                  <p className="text-sm font-semibold">
                    {subject}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {body}
                  </p>
                </div>
              );
            },
          )}
        </div>
      )}
    </section>
  );
}