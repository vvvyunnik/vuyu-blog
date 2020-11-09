import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/Home.module.scss';

const { CONTENT_API_KEY, API_URL } = process.env;

type Post = {
  title: string,
  html: string,
  slug: string
}

async function getPost(slug: string) {
  const url = `${CONTENT_API_KEY}/ghost/api/v3/content/posts/slug/${slug}?key=${API_URL}&fields=title,slug,html`;

  const res = await fetch(
    url
  ).then((res) => res.json());

  return res.posts[0]
}

// request to backend (Ghost CMS)
export const getStaticProps = async ({ params }) => {
  const post = await getPost(params.slug)
  return {
    props: { post },
    revalidate: 10
  }
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: true
  }
}

const Post: React.FC<{ post: Post }> = (props) => {
  const { post } = props;
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={styles.container}>
      <p className={styles.goback}>
        <Link href="/">
          <a>Go back</a>
        </Link>
      </p>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
    </div>
  )
}

export default Post