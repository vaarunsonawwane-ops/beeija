import type { ReactNode } from "react";

type BeeijaNoticeProps = {
  children: ReactNode;
};

export default function BeeijaNotice({
  children,
}: BeeijaNoticeProps) {
  return (
    <div className="mt-6 rounded-r-xl border-l-4 border-[#F2C94C] bg-[#FFFBEA] px-4 py-3 text-sm leading-relaxed text-gray-700">
      <p>
        <span className="font-semibold text-gray-900">*</span>{" "}
        <span className="font-semibold text-gray-900">Important:</span>{" "}
        {children}
      </p>
    </div>
  );
}
