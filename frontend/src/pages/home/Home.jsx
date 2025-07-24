import { useSelector } from "react-redux";
import Lottie from "lottie-react";
import light from "../../assets/background/light.png";
import dark from "../../assets/background/dark.png";
import heroAnimation from "../../assets/animations/heroAnimation.json";

const Home = () => {
  const { theme } = useSelector((state) => state.theme);
  const heroBg = theme === "dark" ? dark : light;

  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-100 dark:bg-gray-900 min-h-screen">
        {/* Hero Section */}
        <section
          className="relative w-full h-screen bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-black dark:text-white px-4 mb-24">
            <div className="flex mb-10">
              <Lottie
                animationData={heroAnimation}
                loop={true}
                className="w-44 h-auto max-w-lg mx-auto"
              />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              AI-Powered Hiring Made Simple
            </h1>
            <p className="text-lg max-w-2xl mb-6">
              Revolutionizing recruitment with AI-driven skill profiling,
              automated assessments, and smart job matching.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
