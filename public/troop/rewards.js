import { handleSkeletons } from "../utils/skeletons.js";

const mainContent = document.getElementsByClassName("main-content")[0];
handleSkeletons.hideNeedSkeletons(mainContent);
handleSkeletons.rewardSkeleton(mainContent, 2);

setTimeout(() => {
    handleSkeletons.removeSkeletons(mainContent);
}, 3000);