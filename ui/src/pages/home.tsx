import { motion } from "framer-motion";
import React from "react";
import { Button } from "@/components/ui/button";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import BlurIn from "@/components/magicui/blur-in";
import AnimatedImage from "@/components/AnimatedImage";
import { useNavigate } from "react-router-dom";
import LoginModal from "@/components/onboard/login-modal";
import { SparklesCore } from "@/components/ui/sparkles";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const MotionDiv = motion.div;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <main>
      <div className="z-0 relative min-h-screen w-full pb-40 overflow-hidden bg-[radial-gradient(97.14%_56.45%_at_51.63%_0%,_#7D56F4_0%,_#4517D7_30%,_#000_100%)]">
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(50vw_circle_at_center,white,transparent)]"
          )}
        />
         <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={72}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
            <MotionDiv
              className="relative z-10 flex flex-col items-center justify-start min-h-screen space-y-6 px-4 pt-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* <motion.div variants={itemVariants}>
                <div className="bg-slate-900 bg-opacity-10 border-white border border-opacity-30 backdrop-blur-sm border-1 backdrop-filter backdrop-blur-lg rounded-3xl px-6 py-2 mt-16">
                  <BlurIn
                    word="Introduction to the future"
                    className="font-display text-center !text-sm font-normal text-white w-full lg:w-auto max-w-4xl mx-auto z-10"
                    duration={1}
                  />
                </div>
              </motion.div> */}
              <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
      >
        <span>Introduction to the future</span>
      </HoverBorderGradient>
              <motion.div variants={itemVariants}>
                <BlurIn
                  word="New era of development, powered by AI and AVS"
                  className="font-display text-center text-5xl font-bold text-white w-full lg:w-auto max-w-4xl mx-auto z-10"
                  duration={1}
                />
              </motion.div>

              <motion.h2
                className="text-lg text-white text-opacity-80 tracking-normal text-center font-light max-w-2xl mx-auto z-10 text-balanced mt-20"
                variants={itemVariants}
              >

                Decentralised AI-powered code auditing IDE and marketplace. Using AVS
                for validation and inference.
              </motion.h2>


              <motion.div variants={itemVariants} className="z-20">
                {/* <Button size="lg" className="shadow-2xl mb-10">
              Login
            </Button> */}
                <LoginModal />
              </motion.div>

              <motion.div variants={itemVariants} className="mt-0 text-center">
                <h3 className="text-white text-md">Powered by</h3>
                <div className="flex justify-center items-center space-x-16">
                  <div className="w-24 h-20 flex items-center">
                    <img src="/eigen layer.png" alt="Eigen Layer Logo" className="w-full h-auto object-contain" />
                  </div>
                  <div className="w-32 h-28 flex items-center">
                    <img src="/Othentic.png" alt="Othentic Logo" className="w-full h-auto object-contain" />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <AnimatedImage
                  src="/shot.png"
                  alt="Web3 IDE Screenshot"
                  width={1200}
                  height={900}
                  className="w-full h-auto max-w-6xl mx-auto rounded-2xl shadow-lg"
                />
              </motion.div>
            </MotionDiv>
            <div>
              <Button onClick={() => navigate("/code")}>Go to editor</Button>
              <Button
                onClick={() =>
                (window.location.href =
                  "https://github.com/login/oauth/authorize?client_id=Ov23liRv0ktKpaw29Jfw&scope=repo,user")
                }
              >
                Sign in with GitHub
              </Button>

            </div>
      </div>

    </main>
  );
}
