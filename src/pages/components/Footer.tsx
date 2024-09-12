import Link from "next/link";
import me from "../../../public/me.jpg";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import { TbBrandTwitter } from "react-icons/tb";

const Footer = () => {
  return (
    <>
      <div className="footer w-full h-[30vh] font-peyda flex flex-col justify-center items-center gap-4">
        <Image
          src={me}
          alt="Reza Aghajani"
          width={80}
          height={80}
          className="rounded-full"
        />
        <div className=" flex flex-col justify-center items-center">
          <h1 className="font-bold text-xl">رضا آقاجانی</h1>
          <h1>ساخته شده بدون ❤️</h1>
        </div>

        <div className="social-media flex flex-row gap-4">
          <Link href={"https://instagram.com/rezasmind"}>
            <FaInstagram color="#66D7D1" size={20} />
          </Link>

          <Link href={"https://twitter.com/rezasmind"}>
            <TbBrandTwitter color="#66D7D1" size={20} />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Footer;
