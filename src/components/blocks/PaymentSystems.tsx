import Image from "next/image";

type Variant = "cards" | "secure";

const images = {
  cards: {
    src: "/images/payment-systems/cards.png",
    alt: "К оплате принимаются карты VISA, MasterCard и МИР",
    width: 526,
    height: 73,
    maxWidth: 300,
  },
  secure: {
    src: "/images/payment-systems/secure.png",
    alt: "Платежи защищены технологиями Verified by Visa, MasterCard SecureCode и MIR Accept",
    width: 583,
    height: 80,
    maxWidth: 330,
  },
} as const;

type PaymentSystemsProps = {
  variant?: Variant;
  caption?: string;
  className?: string;
};

export function PaymentSystems({
  variant = "cards",
  caption,
  className = "",
}: PaymentSystemsProps) {
  const image = images[variant];

  return (
    <div className={className}>
      <div className="inline-flex flex-col items-start gap-3 border border-line bg-white p-5">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={`${image.maxWidth}px`}
          style={{ width: "100%", maxWidth: image.maxWidth, height: "auto" }}
        />
        {caption ? (
          <p className="text-xs leading-relaxed text-ink-muted">{caption}</p>
        ) : null}
      </div>
    </div>
  );
}
