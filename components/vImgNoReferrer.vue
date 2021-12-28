<script>
/*  eslint-disable */
import { VImg } from 'vuetify\\lib\\components\\VImg';

const hasIntersect = typeof window !== 'undefined' && 'IntersectionObserver' in window;

export default {
  name: 'VImgNoReferrer',

  extends: VImg,

  methods: {
    init(entries, observer, isIntersecting) {
      // If the current browser supports the intersection
      // observer api, the image is not observable, and
      // the eager prop isn't being used, do not load
      if (
        hasIntersect
        && !isIntersecting
        && !this.eager
      ) return;

      if (this.normalisedSrc.lazySrc) {
        const lazyImg = new Image();
        lazyImg.referrerPolicy = 'no-referrer';
        lazyImg.src = this.normalisedSrc.lazySrc;
        this.pollForSize(lazyImg, null);
      }
      /* istanbul ignore else */
      if (this.normalisedSrc.src) this.loadImage();
    },
    loadImage() {
      const image = new Image();
      image.referrerPolicy = 'no-referrer';

      this.image = image;

      image.onload = () => {
        /* istanbul ignore if */
        if (image.decode) {
          image.decode().catch((err) => {
            consoleWarn(
              'Failed to decode image, trying to render anyway\n\n'
              + `src: ${this.normalisedSrc.src}${
                err.message ? `\nOriginal error: ${err.message}` : ''}`,
              this,
            );
          }).then(this.onLoad);
        } else {
          this.onLoad();
        }
      };
      image.onerror = this.onError;

      this.hasError = false;
      this.sizes && (image.sizes = this.sizes);
      this.normalisedSrc.srcset && (image.srcset = this.normalisedSrc.srcset);
      image.src = this.normalisedSrc.src;
      this.$emit('loadstart', this.normalisedSrc.src);

      this.aspectRatio || this.pollForSize(image);
      this.getSrc();
    },
  },
};

</script>
