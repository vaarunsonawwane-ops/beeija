import type { ReactNode } from "react";

type BeeijaNoticeProps = {
  children: ReactNode;
};

export default function BeeijaNotice({
  children,
}: BeeijaNoticeProps) {
  return (
    <div className="mt-6 rounded-xl border-l-4 border-[#F2C94C] bg-[#FFFBEA] px-5 py-4 text-sm leading-relaxed text-gray-700">
      <p>
        <span className="font-semibold text-gray-900">* Important:</span>{" "}
        {children}
      </p>
    </div>
  );
}
