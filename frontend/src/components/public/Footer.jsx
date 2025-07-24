import logo from "../../assets/public/logo.png";
import { Footer } from "flowbite-react";

export default function FooterComponent() {
  return (
    <Footer container className="bg-white dark:bg-gray-800 shadow-md">
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <Footer.Brand
            href="#"
            src={logo}
            name="EMPLOYEE ATTENDANCE"
            alt="EMPLOYEE ATTENDANCE LOGO"
          />
          <Footer.LinkGroup>
            <Footer.Link href="#">About</Footer.Link>
            <Footer.Link href="#">Privacy Policy</Footer.Link>
            <Footer.Link href="#">Licensing</Footer.Link>
            <Footer.Link href="#">Contact</Footer.Link>
          </Footer.LinkGroup>
        </div>
        <Footer.Divider />
        <Footer.Copyright href="#" by="EMPLOYEE ATTENDANCE CORPORATION" year={2025} />
      </div>
    </Footer>
  );
}
