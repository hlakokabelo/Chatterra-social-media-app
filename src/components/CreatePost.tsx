import * as React from "react";

interface ICreatePostProps {}

const CreatePost: React.FunctionComponent<ICreatePostProps> = () => {
  const [title, setTitle] = React.useState<string>();
  const [content, setContent] = React.useState<string>();

  const handleSubmit = (event: React.SubmitEvent) => {
    event.preventDefault();

    
  };
  return (
    <div>
      <form action="">
        <div>
          <label htmlFor=""></label>
          <input
            type="text"
            id="title"
            required
            onChange={(e) => setTitle(e.target.value)}
          />{" "}
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            rows={5}
            required
            onChange={(e) => setContent(e.target.value)}
          />{" "}
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
