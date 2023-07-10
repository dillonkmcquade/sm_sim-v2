import { styled } from "styled-components";
export default function NewsArticle({ article }) {
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
          <Author>{article.author}</Author>
        </ArticleFooter>
      </Wrapper>
    </StyledLink>
  );
}

const Wrapper = styled.div`
  margin: 1rem auto;
  width: 90vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #343835;
  border-radius: 0.5rem;
  padding: 0 1rem;
`;

const ArticleMain = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 0.2rem 0 1rem 0;
`;

const ArticleImage = styled.img`
  height: 100px;
  width: 100px;
  object-fit: cover;
  border-radius: 1rem;
  align-self: flex-end;
`;
const Publisher = styled.img`
  height: 30px;
  object-fit: cover;
  margin-bottom: 1rem;
`;

const Title = styled.p`
  margin-right: 1rem;
  font-weight: bold;
`;

const ArticleFooter = styled.div`
  padding: 0.2rem;
`;
const Author = styled.p``;

const StyledLink = styled.a`
  text-decoration: none;
  color: #ced1d6;
`;
