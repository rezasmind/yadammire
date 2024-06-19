import Image from "next/image";
import { TiTick } from "react-icons/ti";
import { Button } from "@nextui-org/react";
import stars from "../../public/stars.png";
import elon from "../../public/elon.png";
import jeff from "../../public/jeffbezos.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import bg from "../../public/bg-1.png";
import PricingPage from "./components/PricingPage";

export default function Home() {
  return (
    <main className="background-white w-full">
      <Image src={bg} alt="" className=" absolute" />
      <Image src={bg} alt="" className=" absolute left-0 top-24" />
      <div className="hero w-full h-screen flex justify-center items-center flex-col">
        <h1 className="text-center font-peyda font-bold text-[63px] mb-3">
          هرچی یادت رفت <br></br>
          <span className="text-primary "> ما یادمون میمونه! </span>
        </h1>

        <h3 className="font-peyda mb-6">
          انرژیتو ذخیره کن برای کارای مهمتر بقیشو بسپار به ما
        </h3>

        <ul className="font-peyda flex-col flex gap-2 mb-6">
          <li className="flex flex-row">
            <TiTick color="#66D7D1" />
            دیگه کسی نمیفهمه ADHD داری
          </li>
          <li className="flex flex-row">
            <TiTick color="#66D7D1" />
            نیاز نیست ۴۷ تا آلارم بذاری
          </li>
          <li className="flex flex-row">
            <TiTick color="#66D7D1" />
            دیگه هم از کسی بابت فراموشی عذر نخواه 🗿
          </li>
        </ul>

        <Button className="bg-primary font-peyda py-2 px-4 rounded-lg mb-6">
          شروع نه به فراموشی
        </Button>

        <div className="testimonials-1 flex flex-col justify-center items-center gap-2">
          <Image src={stars} alt="" />
          <h1 className="font-peyda">
            <span className=" font-semibold">۳۲۴</span> نفر تا به حال نجات
            یافتند
          </h1>
        </div>
      </div>

      <div className="hero2 w-full mb-24 flex justify-center items-center flex-col">
        <h1 className="font-peyda font-bold text-[32px]  mb-6">
          خسته شدی از بس بابت فراموشیت{" "}
          <span className="text-primary">عذرخواهی</span> کردی؟
        </h1>

        <div className="boxes w-full flex flex-row justify-center  gap-8">
          <div className="left w-1/4 bg-primary rounded-xl p-8">
            <h1 className="font-peyda font-semibold text-2xl">
              ADHD با یادم میره
            </h1>

            <ul className="font-peyda mt-12 text-lg flex flex-col gap-4">
              <li>-به همه کارات به موقع میرسی</li>
              <li>-خانواده و رفیقات ازت خوشحالن</li>
              <li>-تو جیبت پول میمونه</li>
              <li>-سر تایم پروژه هاتو تحویل میدی</li>
            </ul>
          </div>
          <div className="right w-1/4 bg-[#e6e6e6] rounded-xl p-8">
            <h1 className="font-peyda font-semibold text-2xl">
              ADHD بدون یادم میره
            </h1>

            <ul className="font-peyda mt-12 text-lg flex flex-col gap-4">
              <li>-مضحکه خاص و عام میشی</li>
              <li>-انواع فحش های جدید میشنوی</li>
              <li>-کاراتو نمیرسی پس پولیم نداری</li>
              <li>-به تایم مصاحبه استخدامی هم نمیرسی</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="testimonial-2 w-full flex flex-col mb-12">
        <div className="testimonials-1 flex flex-col justify-center items-center gap-3">
          <Image src={stars} alt="" />
          <h1 className="font-peyda max-w-lg text-center text-lg font-semibold">
            با ۶ تا بچه دیگه داشت اسممو یادم میرفت تا اینکه با سرویس یادم میره
            آشنا شدم و تسکامو بهش دادم تا با هوش مصنوعی فوق پیشرفتش بهم یادآوری
            کنه.
          </h1>
          <div className="inf flex-row flex font-peyda gap-3">
            <Image src={elon} alt={""} className="w-12 h-12" />
            <div className="name">
              <h1 className="font-semibold">ایلان ماسک</h1>
              <h1 className="text-[#999999]">پدر ۶ فرزند</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="hero2 w-full mb-24 mt-24 h-[48vh] flex justify-center items-center flex-col">
        <h1 className="font-peyda font-bold text-[32px]  mb-6">
          این <span className="text-primary">۳ تا کار</span> نجاتت میده!
        </h1>

        <div className="sections w-screen flex flex-row justify-center items-center">
          <div className="right w-1/4">
            <Accordion type="single" collapsible className="font-peyda">
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-semibold">
                  ۱. تسکتو بنویس 📝
                </AccordionTrigger>
                <AccordionContent>
                  هیچی میری تو سایت کاری که میخوای بکنی رو مینویسی همین. 
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="font-semibold">
                  ۲. تاریخ و ساعت انجامشو بنویس ⏰
                </AccordionTrigger>
                <AccordionContent>
                  بعدش مشخص میکنی که تسکت کی باید انجام بشه؟
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="font-semibold">
                  ۳. یه تاریخ و ساعتم بده یادآوری کنم 😉
                </AccordionTrigger>
                <AccordionContent>
                  حالا نوبت اینکه بگی چند دقیقه قبلش بهت یادآوری کنم 
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      <div className="testimonial-2 w-full flex flex-col mb-12">
        <div className="testimonials-1 flex flex-col justify-center items-center gap-3">
          <Image src={stars} alt="" />
          <h1 className="font-peyda max-w-lg text-center text-lg font-semibold">
            بین بچه‌ها و کارهای خونه، عملاً یادم نمی‌موند کجا چی گذاشتم! با
            «یادم میره» خیالم راحته که حتی کوچیک‌ترین کارها رو فراموش نمی‌کنم.
            این برنامه واقعاً زندگی من رو نظم داده.
          </h1>
          <div className="inf flex-row flex font-peyda gap-3">
            <Image src={jeff} alt={""} className="w-12 h-12" />
            <div className="name">
              <h1 className="font-semibold">جف بزوس</h1>
              <h1 className="text-[#999999]"> رقیب ایلان ماسک</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="pricing-section w-full  mt-24 bg-[#f7f7f7] flex flex-col justify-center items-center p-14">
        <h1 className="font-peyda font-bold text-[32px]  mb-6">
          با یادم میره <span className="text-primary">فراموشی</span> یک توهمه 😉
        </h1>

        <PricingPage />

      
      </div>
    </main>
  );
}
