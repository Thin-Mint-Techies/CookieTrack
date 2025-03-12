const handleSkeletons = {
    hideNeedSkeletonElems,
    removeSkeletons,
    tableSkeleton: (parent, amount) => createTableSkeleton(parent, amount),
}

function hideNeedSkeletonElems() {
    const elems = document.getElementsByClassName('need-skeleton');

    Array.from(elems).forEach(elem => {
        elem.classList.add('hidden');
    });
}

function removeSkeletons() {
    const skeletons = document.getElementsByClassName('skeleton');
    const needSkeletons = document.getElementsByClassName('need-skeleton');

    Array.from(skeletons).forEach(elem => {
        elem.remove();
    });

    Array.from(needSkeletons).forEach(elem => {
        elem.classList.remove('hidden');
    });
}

function createTableSkeleton(parent, amount) {
    const th = `<th class="after:bg-white after:w-full after:min-w-40 after:h-8 after:block after:rounded-default"></th>`;
    const td = `<td class="after:bg-gray after:w-full after:min-w-40 after:h-8 after:block after:rounded-default"></td>`;
    const bodyTr = `<tr class="[&_td]:p-4 [&_td]:animate-pulse">${td}${td}${td}${td}</tr>`;

    for (let i = 0; i < amount; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton bg-white py-6 px-4 max-w-7xl relative shadow-default mx-auto mt-8 mb-8 rounded-default';
        skeleton.innerHTML = `
        <div class="animate-pulse bg-gray mb-8 rounded-default w-80 h-12 max-sm:max-w-52 max-sm:w-auto max-sm:h-8"></div>
        <div class="overflow-x-auto pb-4">
            <table class="animate-pulse min-w-full border-separate border-spacing-0 border-4 border-gray rounded-default">
                <thead class="animate-pulse bg-gray whitespace-nowrap">
                    <tr class="[&_th]:p-4 [&_th]:animate-pulse">
                        ${th}${th}${th}${th}
                    </tr>
                </thead>
                <tbody class="whitespace-nowrap">
                    ${bodyTr}${bodyTr}${bodyTr}
                </tbody>
            </table>
        <div>
        `;
        parent.appendChild(skeleton);
    }
}

export { handleSkeletons };
