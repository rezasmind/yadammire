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
import iconn from "../../public/icon-message.png";
import Link from "next/link";

import bg from "../../public/bg-1.png";
import PricingPage from "./components/PricingPage";

import { cn } from "@/lib/utils";
import AnimatedList from "./components/animated-list";
import AvatarCircles from "./components/avatar-circles";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import { FaUser, FaTasks } from "react-icons/fa";
import { parseString } from "xml2js";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const avatarUrls = [
  "https://avatars.githubusercontent.com/u/20110627",
  "https://avatars.githubusercontent.com/u/106103625",
  "https://avatars.githubusercontent.com/u/59228569",
];

interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

let notifications = [
  {
    name: "باشگاه یادت نره",
    description: "ساعت ۱۷ امروز باشگاه تمرین دارم",
    time: "15m ago",

    icon: "",
    color: "#00C9A7",
  },
  {
    name: "جلسه با آقای احمدی",
    description: " ساعت ۱۶ کافه رز جلسه قرارداد داری",
    time: "10m ago",

    icon: "💼",
    color: "#d63031",
  },

  {
    name: "ادیت ویدیو هلدینگ ریزآبادی",
    description: "       امشب ساعت ۸ باید پستش آپلود شه ادیت ریلزشو بزن",
    time: "5m ago",

    icon: "💻",
    color: "#0984e3",
  },
];

notifications = Array.from({ length: 10 }, () => notifications).flat();

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full z-[99] max-w-[400px] transform cursor-pointer overflow-hidden rounded-2xl p-4 font-peyda",
        // animation styles
        "transition-all duration-500 ease-in-out hover:scale-[103%]",
        // light styles
        " bg-slate-50 shadow-lg border",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center gap-1 z-99 ">
        <div className="flex items-center justify-center rounded-2xl ">
          <span className="text-lg flex p-0 justify-center items-center">
            <Image src={iconn} alt="" width={65} />
          </span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

export function AnimatedListDemo() {
  return (
    <div className="absolute hidden sm:flex max-h-[400px] top-0 right-0 min-h-[400px] w-full max-w-[32rem] flex-col overflow-hidden rounded-lg p-6 z-99 to-transparent gradient-mask-b-4">
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>
    </div>
  );
}

interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  author: string;
}

export default function Home() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [taskCount, setTaskCount] = useState<number | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      const { count: userCount, error: userError } = await supabase
        .from("User")
        .select("*", { count: "exact", head: true });

      const { count: taskCount, error: taskError } = await supabase
        .from("Tasks")
        .select("*", { count: "exact", head: true });

      if (userError) console.error("Error fetching user count:", userError);
      if (taskError) console.error("Error fetching task count:", taskError);

      setUserCount(userCount);
      setTaskCount(taskCount);
    }

    async function fetchBlogPosts() {
      try {
        console.log("Fetching blog posts...");
        const response = await fetch("/blogrss.xml");
        const xmlData = await response.text();
        console.log("XML file fetched successfully");

        parseString(xmlData, (err, result) => {
          if (err) {
            console.error("Error parsing XML:", err);
            setError("Error parsing XML");
            return;
          }
          console.log("XML parsed successfully");

          if (
            !result.rss ||
            !result.rss.channel ||
            !result.rss.channel[0].item
          ) {
            console.error("Unexpected XML structure:", result);
            setError("Unexpected XML structure");
            return;
          }

          const items = result.rss.channel[0].item;
          console.log(`Found ${items.length} items in the feed`);

          const lastThreePosts = items.slice(0, 3).map((item: any) => ({
            title: item.title ? item.title[0] : "No Title",
            link: item.link ? item.link[0] : "#",
            pubDate: item.pubDate ? item.pubDate[0] : "No Date",
            description: item.description
              ? item.description[0]
              : "No Description",
            author: item.author ? item.author[0] : "Unknown Author",
          }));
          console.log("Processed blog posts:", lastThreePosts);
          setBlogPosts(lastThreePosts);
        });
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    }

    fetchCounts();
    fetchBlogPosts();
  }, []);

  return (
    <main className="background-white w-full">
      <div className="header w-full flex justify-center items-center">
        <Header />
      </div>
      {AnimatedListDemo()}
      <div className="hero w-full min-h-screen flex justify-center items-center flex-col px-4 py-12 sm:py-24">
        <h1 className="text-center font-peyda font-bold text-4xl sm:text-5xl mb-3">
          هرچی یادت رفت <br></br>
          <span className="text-primary "> ما یادمون میمونه! </span>
        </h1>

        <h3 className="font-peyda mb-6 text-center text-lg sm:text-xl">
          انرژیتو ذخیره کن برای کارای مهمتر بقیشو بسپار به ما
        </h3>

        <ul className="font-peyda flex-col flex gap-2 mb-6 text-center">
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
          <Link href="/auth">شروع نه به فراموشی</Link>
        </Button>

        <div className="testimonials-1 flex flex-col justify-center items-center gap-2">
          <div className="flex gap-0">
            <AvatarCircles numPeople={321} avatarUrls={avatarUrls} />
          </div>

          <div className="font-peyda flex justify-center items-center gap-6 mt-4 bg-gray-100 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <FaUser className="text-primary text-xl" />
              <p>
                <span className="font-semibold text-lg">{userCount}</span>
                <span className="text-sm text-gray-600 mr-1">کاربر</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FaTasks className="text-primary text-xl" />
              <p>
                <span className="font-semibold text-lg">{taskCount}</span>
                <span className="text-sm text-gray-600 mr-1">تسک</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hero2 w-full mb-12 sm:mb-24 flex justify-center items-center flex-col px-4">
        <h1 className="font-peyda font-bold text-2xl sm:text-3xl text-center mb-6">
          خسته شدی از بس بابت فراموشیت{" "}
          <span className="text-primary">عذرخواهی</span> کردی؟
        </h1>

        <div className="boxes w-full flex flex-col sm:flex-row justify-center gap-8">
          <div className="left w-full sm:w-1/4 bg-primary rounded-xl p-6 sm:p-8 border">
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
          <div className="right w-full sm:w-1/4 bg-[#e6e6e6] rounded-xl p-6 sm:p-8">
            <h1 className="font-peyda font-semibold text-2xl">
              ADHD بدون یادم میره
            </h1>

            <ul className="font-peyda mt-12 text-lg flex flex-col gap-4">
              <li>-ضحکه خاص و عام میشی</li>
              <li>-انواع فحش های جدید میشنوی</li>
              <li>-کاراتو نمیرسی پس پولیم نداری</li>
              <li>-به تایم مصاحبه استخدامی هم نمیرسی</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="testimonial-2 w-full flex flex-col mb-12 px-4">
        <div className="testimonials-1 flex flex-col justify-center items-center gap-3">
          <Image src={stars} alt="" />
          <h1 className="font-peyda max-w-lg text-center text-lg font-semibold">
            با ۶ تا بچه دیگه داشت اسممو یادم رفت تا اینکه با سرویس یادم میره
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

      <div className="hero2 w-full mb-12 sm:mb-24 flex justify-center items-center flex-col px-4">
        <h1 className="font-peyda font-bold text-2xl sm:text-3xl text-center mb-6">
          این <span className="text-primary">۳ تا کار</span> نجاتت میده!
        </h1>

        <div className="sections w-full flex flex-col sm:flex-row justify-center items-center">
          <div className="right w-full sm:w-1/2">
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

      <div className="testimonial-2 w-full flex flex-col mb-12 px-4">
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

      <div className="pricing-section w-full mt-12 sm:mt-24 bg-[#f7f7f7] flex flex-col justify-center items-center p-8 sm:p-14">
        <h1 className="font-peyda font-bold text-2xl sm:text-3xl text-center mb-6">
          با یادم میره <span className="text-primary">فراموشی</span> یک توهمه 😉
        </h1>

        <PricingPage />
      </div>

      <div className="blog-posts w-full   bg-[#f7f7f7]  flex flex-col justify-center items-center p-8 sm:p-14">
        <div className="w-1/2">
          <h2 className="font-peyda font-bold text-2xl sm:text-3xl text-center mb-6">
            آخرین مطالب وبلاگ
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <a
                  key={index}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
                >
                  <div className="p-6 flex flex-col h-full">
                    <h3 className="font-peyda font-bold text-xl mb-3 text-gray-800 group-hover:text-primary transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(post.pubDate).toLocaleDateString("fa-IR")}
                    </p>
                    <p className="text-sm text-gray-700 mb-4 flex-grow">
                      {post.description.substring(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-xs text-gray-500 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {post.author}
                      </p>
                      <span className="text-primary font-semibold text-sm group-hover:underline">
                        ادامه مطلب
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p>Loading blog posts...</p>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
