import Image from "./Image";
import LogoCorporativo from "@/assets/images/logo-corporativo.png";

export interface HeaderProps {
  className?: string;
  children: React.ReactNode;
}

const Header = ({ children, className }: HeaderProps) => {
  return (
    <header
      className={`w-full flex justify-between bg-ct-primary ${className}`}
    >
      <div className="flex">
        <div className="hidden md:block w-auto mx-4 py-3">
          <Image src={LogoCorporativo} alt="Logo" width={150} />
        </div>

        <div className="my-auto flex items-center justify-center">
          <div className="hidden md:block">
            {/* <TitleHeader tooltipLabel={headerLabels[portalEmAcesso]}>
              {headerTitles[portalEmAcesso]}
            </TitleHeader> */}
          </div>
        </div>
      </div>

      <div className="flex items-center">
        {children}
        {/* <HeaderActions /> */}
      </div>
    </header>
  );
};

export default Header;
