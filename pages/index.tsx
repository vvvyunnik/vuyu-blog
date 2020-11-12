import styles from '../styles/Home.module.scss';
import Link from 'next/link';

const { CONTENT_API_KEY, API_URL } = process.env;

type Post = {
  title: string
  slug: string
}

async function getPosts() {
  const url = `${API_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}&fields=title,slug,custom_excerpt`;
  
  const res = await fetch(
    url
  ).then((res) => res.json());

  return res.posts
}

export const getStaticProps = async ({ params }) => {
  const posts = await getPosts();

  return {
    revalidate: 10,
    props: { posts }
  }
}

const Home: React.FC<{ posts: Post[] }> = (props) => {
  const { posts } = props;

  return (
    <div className={styles.container}>
      <h1>#someInterestingLinks</h1>
      <ul>
        {posts.map((post, index) => {
          return (
            <li className={styles.post} key={post.slug}>
              <Link href="/post/[slug]" as={`/post/${post.slug}`}>
                <a>{post.title}</a>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Home