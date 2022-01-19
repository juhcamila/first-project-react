import './styles.css';
import { Component } from 'react';
import { loadPosts } from '../../utils/load-posts';
import { Post } from '../../components/Post'
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';

class App extends Component {
  state = {
    posts: [],
    allPosts: [],
    page: 0,
    postsPerPage: 10,
    searchValue: ''
  };

  async componentDidMount() {
    await this.loadPosts();
  }

  loadPosts = async () => {
    const { page, postsPerPage } = this.state;

    const postsAndPhotos = await loadPosts();
    this.setState({
      posts: postsAndPhotos.slice(page, postsPerPage),
      allPosts: postsAndPhotos,
    })
  }

  loadMorePosts = () => {
    const {
      page,
      postsPerPage,
      allPosts,
      posts
    } = this.state;
    const nextPage = page + postsPerPage;
    const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage);
    posts.push(...nextPosts);

    this.setState({ posts, page: nextPosts })
  }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ searchValue: value });
  }

  handleSearch = () => {
    const { allPosts, searchValue } = this.state;

    return allPosts.filter(post => {
      return post.title.toLowerCase().includes(searchValue.toLowerCase())
    })
  }

  render() {
    const { posts, page, postsPerPage, allPosts, searchValue } = this.state;
    const noMorePosts = (page + postsPerPage) >= allPosts.length;
    const filteredPosts = !!searchValue ? this.handleSearch() : posts;

    return (
      <section className="container">

        <div className="search-container">
          <TextInput
            searchValue={searchValue}
            handleChange={this.handleChange}
          />
        </div>

        {filteredPosts.length > 0 && (
          <Post posts={filteredPosts} />
        )}

        {filteredPosts.length === 0 && (
          <h1>Não existem posts =(</h1>
        )}
        <div className="button-container">
          {!searchValue && (
            <Button
              text="Load more posts"
              onClick={this.loadMorePosts}
              disabled={noMorePosts}
            />
          )}
        </div>
      </section>
    );
  }
}

export default App;
