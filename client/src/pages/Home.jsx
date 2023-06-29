import { styled } from "styled-components";
import { Link } from "react-router-dom";
import Slide from "react-reveal/Slide";
import Fade from "react-reveal/Fade";

export default function Home() {
  return (
    <Wrapper>
      <Hero>
        <Fade>
          <GreetingHead>
            Practice your investing skills without risk
          </GreetingHead>
          <GreetingText>
            Research, buy, and sell stocks while tracking your portfolio. Use
            real-life data to practice your investing skills at no risk!
          </GreetingText>
          <Link to="/dashboard">
            <GetStarted>Get Started</GetStarted>
          </Link>
        </Fade>
      </Hero>
      <ResearchStocks>
        <Slide bottom cascade>
          <GreetingHead>Research up to 17,000 different stocks</GreetingHead>
          <GreetingText>
            Get real market data, analyze and compare stocks, and learn about
            publicly traded companies
          </GreetingText>
          <Link to="/research">
            <GetStarted>Research</GetStarted>
          </Link>
        </Slide>
      </ResearchStocks>
      <StackedCoins>
        <Slide bottom cascade>
          <GreetingHead>Create an account</GreetingHead>
          <GreetingText>
            Track your portfolio, purchases, and sales by creating an account
          </GreetingText>
          <Link to="/signup">
            <GetStarted>Sign up</GetStarted>
          </Link>
        </Slide>
      </StackedCoins>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: 100vw;
`;

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
  background-image: linear-gradient(to bottom, rgba(117, 19, 93, 0.73), #000000),
    url("./bob-ghost-ZmLXBRfjSpo-unsplash.jpg");
  background-size: contain;
`;

const GreetingHead = styled.h1`
  font-size: 2.4rem;
  margin: 1rem 0;
  color: #e5e9f0;
`;
const GreetingText = styled.h3`
  margin: 1rem 0;
  line-height: 2;
  max-width: 80vw;
`;

const GetStarted = styled.button`
  background: linear-gradient(
    90deg,
    rgba(152, 148, 230, 1) 0%,
    rgba(121, 9, 119, 1) 100%,
    rgba(0, 212, 255, 1) 100%
  );
  color: #000000;
  font-size: 1.2rem;
  border: none;
  padding: 0.75rem;
  border-radius: 1rem;
  cursor: pointer;
  transition: scale ease-in-out 300ms;
  transition: background ease-in-out 1000ms;

  &:active {
    scale: 0.9;
  }

  &:hover {
    background: linear-gradient(
      90deg,
      rgba(152, 148, 230, 0.8) 0%,
      rgba(121, 9, 119, 0.8) 100%,
      rgba(0, 212, 255, 0.8) 100%
    );
  }
`;

const StackedCoins = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-image: linear-gradient(
      to bottom,
      #000000,
      rgba(191, 237, 204, 0.53)
    ),
    url("./stackedCoins.jpg");
  background-size: cover;
`;

const ResearchStocks = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 1rem;
  height: 100vh;
  background-image: linear-gradient(
      to bottom,
      #000000,
      rgba(117, 19, 93, 0.73),
      #000000
    ),
    url("./candleChart.avif");
  background-size: contain;
`;
