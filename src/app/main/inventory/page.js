import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxesStacked, faCookieBite, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

export default function Inventory() {
    return (
        <div className="mt-12 mb-6 px-2">
            <div className="bg-white py-6 px-4 max-w-6xl relative shadow-default mx-auto rounded-default">
                <h2 className="text-green text-4xl max-sm:text-2xl font-extrabold mb-8">
                    <FontAwesomeIcon icon={faBoxesStacked} /> Current Inventory
                </h2>
                <div className="overflow-x-auto pb-4">
                    <table className="min-w-full border-separate border-spacing-0 border-4 border-green rounded-default">
                        <thead className="bg-green whitespace-nowrap">
                            <tr className="text-left text-lg text-white [&_th]:p-4 [&_th]:font-normal">
                                <th>Cookie Name</th>
                                <th>Amount In Stock</th>
                                <th>Amount Sold This Month</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="whitespace-nowrap">
                            <tr className="even:bg-gray text-sm text-black [&_td]:p-4">
                                <td>Thin Mints</td>
                                <td>343</td>
                                <td>57</td>
                                <td>
                                    <button className="mr-4" title="Edit">
                                        <FontAwesomeIcon icon={faPenToSquare} className="text-xl text-blue-500 hover:text-blue-700" />
                                    </button>
                                    <button className="mr-4" title="Delete">
                                        <FontAwesomeIcon icon={faTrashCan} className="text-xl text-red-500 hover:text-red-700" />
                                    </button>
                                </td>
                            </tr>
                            <tr className="even:bg-gray text-sm text-black [&_td]:p-4">
                                <td>Lemonades</td>
                                <td>250</td>
                                <td>50</td>
                                <td>
                                    <button className="mr-4" title="Edit">
                                        <FontAwesomeIcon icon={faPenToSquare} className="text-xl text-blue-500 hover:text-blue-700" />
                                    </button>
                                    <button className="mr-4" title="Delete">
                                        <FontAwesomeIcon icon={faTrashCan} className="text-xl text-red-500 hover:text-red-700" />
                                    </button>
                                </td>
                            </tr>
                            <tr className="even:bg-gray text-sm text-black [&_td]:p-4">
                                <td>Adventurefuls</td>
                                <td>100</td>
                                <td>20</td>
                                <td>
                                    <button className="mr-4" title="Edit">
                                        <FontAwesomeIcon icon={faPenToSquare} className="text-xl text-blue-500 hover:text-blue-700" />
                                    </button>
                                    <button className="mr-4" title="Delete">
                                        <FontAwesomeIcon icon={faTrashCan} className="text-xl text-red-500 hover:text-red-700" />
                                    </button>
                                </td>
                            </tr>
                            <tr className="even:bg-gray text-sm text-black [&_td]:p-4">
                                <td>Caramel Chocolate Chip</td>
                                <td>327</td>
                                <td>43</td>
                                <td>
                                    <button className="mr-4" title="Edit">
                                        <FontAwesomeIcon icon={faPenToSquare} className="text-xl text-blue-500 hover:text-blue-700" />
                                    </button>
                                    <button className="mr-4" title="Delete">
                                        <FontAwesomeIcon icon={faTrashCan} className="text-xl text-red-500 hover:text-red-700" />
                                    </button>
                                </td>
                            </tr>
                            <tr className="even:bg-gray text-sm text-black [&_td]:p-4">
                                <td>Do-si-dos</td>
                                <td>450</td>
                                <td>150</td>
                                <td>
                                    <button className="mr-4" title="Edit">
                                        <FontAwesomeIcon icon={faPenToSquare} className="text-xl text-blue-500 hover:text-blue-700" />
                                    </button>
                                    <button className="mr-4" title="Delete">
                                        <FontAwesomeIcon icon={faTrashCan} className="text-xl text-red-500 hover:text-red-700" />
                                    </button>
                                </td>
                            </tr>
                            <tr className="even:bg-gray text-sm text-black [&_td]:p-4">
                                <td>Caramel deLites</td>
                                <td>172</td>
                                <td>33</td>
                                <td>
                                    <button className="mr-4" title="Edit">
                                        <FontAwesomeIcon icon={faPenToSquare} className="text-xl text-blue-500 hover:text-blue-700" />
                                    </button>
                                    <button className="mr-4" title="Delete">
                                        <FontAwesomeIcon icon={faTrashCan} className="text-xl text-red-500 hover:text-red-700" />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-end mt-2">
                    <button
                        id="upload-files"
                        type="button"
                        className="w-auto shadow-default py-3 px-4 text-xl tracking-wide rounded-default text-white bg-orange hover:bg-orange-light accent-green"
                    >
                        <FontAwesomeIcon icon={faCookieBite} /> Add New Cookies
                    </button>
                </div>
            </div>

        </div>

    );
}