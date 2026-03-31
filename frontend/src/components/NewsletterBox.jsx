 
 const NewsletterBox = () => {
   const onSubmitHandler = (event) => {
     event.preventDefault();
   };
 
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-2xl font-medium text-brand-text-primary">
        Join our community & stay updated
      </p>

      <p className="text-brand-text-secondary mt-2">
        Get the latest news, exclusive offers, and style tips delivered to your inbox
      </p>

      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border border-brand-border pl-3 bg-white"
      >
        <input
          className="w-full sm:flex-1 outline-none py-4 bg-transparent text-brand-text-primary placeholder-brand-text-secondary"
          type="email"
          placeholder="Enter your email"
          required
        />

        <button
          type="submit"
          className="bg-brand-accent text-white text-xs px-10 py-4 hover:bg-black transition-all duration-300 tracking-widest font-semibold uppercase"
        >
          JOIN NOW
        </button>
      </form>
    </div>
  );
 };
 
 export default NewsletterBox;