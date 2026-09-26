import { Lottie } from 'lottie-react'
import animationData from '../../assets/icons/nasi-fashion-runway-approach.lottie.json'

const Loader = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-nasi-blackberry-200">
      <div className="flex flex-col items-center justify-center gap-4 -translate-y-12">
        <Lottie
          src={animationData}
          loop={true}
          autoplay={true}
          style={{ width: 320, height: 380, display: 'block' }}
        />
      </div>
    </div>
  )
}

export default Loader
