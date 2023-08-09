import React from "react";

import logo from "../assets/image/logo.png";
const About = () => {
  return (
    <div>
      <div className="hero">
        <div className="container py-5 my-5">
          <div className="row">
            <div className="col-md-12">
              <h1 className="text fw-bold mb-4" style={{ textAlign: "center" }}>
                What exactly does FPC do?
              </h1>
              <p
                className="mb-4"
                style={{ margin: "0 100px", fontSize: "20px" }}
              >
                Performance optimization: This involves tuning various settings
                to maximize the performance of the PC, such as adjusting
                graphics settings, optimizing memory usage, and prioritizing
                system resources for gaming applications.
              </p>
              <p
                className="mb-4"
                style={{ margin: "0 100px", fontSize: "20px" }}
              >
                Hardware optimization: This involves optimizing the hardware
                components of the PC, such as the graphics card and CPU, to
                ensure they are running at their best possible performance
                levels.
              </p>
              <p
                className="mb-4"
                style={{ margin: "0 100px", fontSize: "20px" }}
              >
                Software optimization: This involves optimizing the software
                components of the PC, such as the operating system and drivers,
                to ensure they are up to date and configured correctly for
                gaming.
              </p>
              <p
                className="mb-4"
                style={{ margin: "0 100px", fontSize: "20px" }}
              >
                Overclocking (very mild, and optional): This involves tweaking
                the hardware settings of the PC to achieve higher performance
                levels than the default settings.
              </p>
              <p
                className="mb-4"
                style={{ margin: "0 100px", fontSize: "20px" }}
              >
                Benchmarking: This involves measuring the performance of the PC
                before and after optimization, to provide tangible evidence of
                the improvements made.
              </p>
              <p
                className="mb-4"
                style={{ margin: "0 100px", fontSize: "20px" }}
              >
                Contact us today to learn more about how we can optimize your
                gaming experience without any risk to your personal data, work
                applications, hardware warranties, or system stability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
