import { styled } from "styled-components";
import { Link } from "react-router-dom";
import Slide from "react-reveal/Slide";
import Fade from "react-reveal/Fade";
import { useAuth0 } from "@auth0/auth0-react";

import Button from "../components/Button";

export default function Home() {
  const { loginWithRedirect } = useAuth0();
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
            <Button>Get Started</Button>
          </Link>
        </Fade>
      </Hero>
      <ResearchStocks>
        <Slide bottom>
          <GreetingHead>Research up to 17,000 different stocks</GreetingHead>
          <GreetingText>
            Get real market data, analyze and compare stocks, and learn about
            publicly traded companies
          </GreetingText>
          <Link to="/research">
            <Button>Research</Button>
          </Link>
        </Slide>
      </ResearchStocks>
      <StackedCoins>
        <Slide bottom>
          <GreetingHead>Create an account</GreetingHead>
          <GreetingText>
            Track your portfolio, purchases, and sales by creating an account
          </GreetingText>
          <Button handler={() => loginWithRedirect()}>Sign up</Button>
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
