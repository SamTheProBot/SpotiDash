import { useEffect, useState, useContext } from 'react';
import { URL } from '../util/url';
import axios from 'axios';
import { PlaylistContext, TokenContext } from '../context/Context';
import { Link } from 'react-router-dom';
const blendEndpoint = `${URL}/api/v1/blendplaylist`;

const FilterBlend = () => {
  const { token } = useContext(TokenContext);
  const { userPlaylist } = useContext(PlaylistContext);
  const [selectedBlends, setSelectedBlends] = useState([]);
  const [seletedFilter, setSeletedFilter] = useState([]);
  const [playlistExist, setPlaylistExist] = useState(false);
  const [selectedItems, setSelectedItems] = useState({
    blendlist: [],
    filterlist: [],
  });

  useEffect(() => {
    const blendIds = userPlaylist.filter(
      (item) =>
        item.description.slice(2, 7) === `Blend` &&
        item.owner.display_name === `Spotify`
    );
    setSelectedBlends(blendIds);
    const notBlendIds = userPlaylist.filter((item) => {
      if (item.owner.display_name === `Spotify`) {
        return item.description.slice(2, 7) !== `Blend`;
      } else {
        return (
          item.description.slice(2, 7) !== `Blend` &&
          item.owner.display_name !== `Spotify`
        );
      }
    });
    setSeletedFilter(notBlendIds);
  }, [userPlaylist]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedBlends.length === 0) {
      console.log(`Blend playlist not found`);
      return;
    }
    const postPlaylistData = async () => {
      try {
        await axios.post(blendEndpoint, selectedItems);
      } catch (e) {
        throw e;
      }
    };
    postPlaylistData();
    setTimeout(() => {
      setPlaylistExist(true);
    }, 500);
  };

  if (playlistExist === true) {
    return (
      <>
        <header className=' flex justify-end flex-row h-[10%] w-[100%] pr-6 lg:pt-5 lg:pr-12 overflow-hidden mb-12 lg:mb-24'>
          <Link to={`/dashboard`}>
            <button className='text-black font-semibold bg-custonmGreen hover:bg-custonmGreenHover w-[7rem] lg:w-[9rem] h-[2rem] lg:h-[2.5rem] rounded-[30px] border-[5px] border-[rgba(0,0,0,0.2)]'>
              Go-Back
            </button>
          </Link>
        </header>
        <section className='flex items-center justify-center w-[75%] sm:w-[65%] md:w-[55%] lg:w-[45%] xl:w-[30%] h-[55%]'>
          <div className='flex flex-col text-4xl'>
            Playlist Added!
            <span className=' text-lg text-center mt-1'>
              might take a few while
            </span>
          </div>
        </section>
      </>
    );
  } else {
    return (
      <>
        <header className=' flex justify-end flex-row lg:h-[10%] w-[100%] pr-6 lg:pt-5 lg:pr-12 overflow-hidden mb-12 lg:mb-4'>
          <Link to={`/dashboard`}>
            <button className='text-black font-semibold bg-custonmGreen hover:bg-custonmGreenHover w-[7rem] lg:w-[9rem] h-[2rem] lg:h-[2.5rem] rounded-[30px] border-[5px] border-[rgba(0,0,0,0.2)]'>
              Go-Back
            </button>
          </Link>
        </header>
        <section className=' w-[90%] sm:w-[85%] md:w-[75%] lg:w-[65%] xl:w-[40%] flex justify-center flex-row  h-[50%] md:h-[55%] lg:h-[60%] lg:pt-0 pt-5'>
          <article
            className={` bg-yellow-500 p-2 h-[100%] w-[50%] rounded-[15px] mr-2 overflow-auto scrollbar-hide border-[5px] border-[rgba(0,0,0,0.2)] scrollbar-thumb-gray-500`}>
            <form>
              {selectedBlends.map((items) => {
                let Name = items.name;
                let imgUrl = items.images[0]?.url;
                let Key = items.id;
                return (
                  <SelectPlatlist
                    key={Key}
                    playlistImage={imgUrl}
                    playlistName={Name}
                    playlistIds={Key}
                    setSelectedItems={setSelectedItems}
                    selectedList='blendlist'
                  />
                );
              })}
            </form>
          </article>
        </section>
        <button
          className='text-black font-semibold bg-custonmGreen hover:bg-custonmGreenHover lg:min-w-[25rem] aspect-[8/1] rounded-[30px] pt-[-80px] border-[5px] border-[rgba(0,0,0,0.2)] mt-[5vh] '
          onClick={handleSubmit}>
          FilterPlaylist
        </button>
      </>
    );
  }
};

const SelectPlatlist = ({
  playlistName,
  playlistImage,
  playlistIds,
  setSelectedItems,
  selectedList,
}) => {
  const [cheakBox, setCheakBox] = useState(false);

  const handleSwitch = (e) => {
    const { checked, id } = e.target;
    setCheakBox(checked);

    setSelectedItems((prev) => ({
      ...prev,
      [selectedList]: checked
        ? [...prev[selectedList], id]
        : prev[selectedList].filter((item) => item !== id),
    }));
  };

  return (
    <>
      <label
        className={`text-sm md:text-base lg:text-lg p-1 pt-2 pb-2 mt-2 flex flex-row items-center shadow-customShadow transition ease-out duration-100 tracking-tight lg:tracking-normal ${cheakBox
          ? ` border-gray-600 bg-[rgba(0,0,0,0.2)] text-gray-400 scale-[0.95]`
          : ` border-gray-500  bg-[rgba(255,252,252,0.1)] hover:scale-[1.05] hover:text-gray-900`
          }
        border-4 rounded-[12px] mb-2 `}>
        <img
          src={playlistImage}
          alt={playlistName}
          className='h-[2.5rem] md:h-[3rem] lg:h-[3.5rem] w-[2.5rem] md:w-[3rem] lg:w-[3.5rem] rounded-[8px] shadow-customShadow'
        />
        <h4 className='pl-2'>{playlistName}</h4>
        <input
          type='checkbox'
          id={playlistIds}
          checked={cheakBox}
          onChange={handleSwitch}
          className='hidden'
        />
      </label>
    </>
  );
};

export default FilterBlend;
