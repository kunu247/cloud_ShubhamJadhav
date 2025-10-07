// File name: LandingImages
// File name with extension: LandingImages.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\landing\LandingImages.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\landing

const LandingImages = () => {
  const instaPosts = [
    "insta-1.jpg",
    "insta-2.jpg",
    "insta-3.jpg",
    "insta-4.jpg",
    "insta-5.jpg",
    "insta-6.jpg",
    "insta-7.jpg",
    "insta-8.jpg"
  ];
  return (
    <section className="section insta-post">
      <ul className="insta-post-list has-scrollbar flex w-full justify-evenly">
        {instaPosts.map((image, index) => (
          <li key={index} className="insta-post-item">
            <img
              src={`/images/${image}`}
              width="190.08"
              height="190.08"
              loading="lazy"
              alt="Instagram post"
              className="insta-post-banner image-contain"
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LandingImages;
