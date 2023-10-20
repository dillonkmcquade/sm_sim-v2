import { styled } from "@mui/material";
import { Article } from "../types";

export default function NewsArticle({ article }: { article: Article }) {
  return (
    <StyledLink href={article.article_url}>
      <Wrapper>
        <ArticleMain>
          <div>
            <Publisher src={article.publisher.logo_url} alt="Publisher logo" />
            <Title>{article.title}</Title>
          </div>
          <ArticleImage src={article.image_url} alt={article.description} />
        </ArticleMain>
        <hr />
        <ArticleFooter>
          <p>{article.author}</p>
        </ArticleFooter>
      </Wrapper>
    </StyledLink>
  );
}

const Wrapper = styled("div")`
  margin: 1rem auto;
  width: 85vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #343835;
  border-radius: 0.5rem;
  padding: 0 1rem;
  @media (min-width: 500px) {
    width: 450px;
    padding: 0.5rem 1rem;
  }
`;

const ArticleMain = styled("div")`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 0.2rem 0 1rem 0;
`;

const ArticleImage = styled("img")`
  height: 100px;
  width: 100px;
  object-fit: cover;
  border-radius: 1rem;
  align-self: flex-end;
`;
const Publisher = styled("img")`
  height: 30px;
  object-fit: cover;
  margin-bottom: 1rem;
`;

const Title = styled("p")`
  margin-right: 1rem;
  font-weight: bold;
  max-height: 65px;
  overflow: hidden;
`;

const ArticleFooter = styled("div")`
  padding: 0.2rem;
`;

const StyledLink = styled("a")`
  text-decoration: none;
  color: #ced1d6;
`;
