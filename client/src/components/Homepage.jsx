import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'lucide-react';

function Homepage() {
    const [searchTrip, setSearchTrip] = useState('');
    const [trips, setTrips] = useState([]);
    const [expandedTripId, setExpandedTripId] = useState(null);
    const [copyId, setCopyId] = useState(null)

    const handleClickReadMore = (id) => {
        // console.log(id);
        setExpandedTripId(expandedTripId === id ? null : id);
    };

    const handleTagClick = (e) => {
        if(searchTrip === ''){
            setSearchTrip(e.target.value)
        }else{
            setSearchTrip(searchTrip + " " + e.target.value)
        }
    };

    const handleCopy = (url,id) => {
        navigator.clipboard.writeText(url)
            .then(()=>{
                console.log(`Copied ${url} complete`);
                setCopyId(copyId === id ? null : id)
                setTimeout(() => {
                    setCopyId(null)
                }, 1500);
            })
            .catch(error =>{
                console.log(`Fail to copy ulr ${error}`);
            })
    }

    const fetchingAllData = async () => {
        try {
            const response = await axios.get('http://localhost:4001/trips');
            setTrips(response.data.data);
        } catch (error) {
            console.log("Fail to fetch all data", error);
        }
    };

    useEffect(() => {
        fetchingAllData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (searchTrip.trim() === '') {
                fetchingAllData();
            } else {
                try {
                    const response = await axios.get(`http://localhost:4001/trips?keywords=${searchTrip}`);
                    setTrips(response.data.data); 
                } catch (error) {
                    console.log("เกิดข้อผิดพลาดในการค้นหาข้อมูล", error);
                }
            }
        };

        fetchData();
    }, [searchTrip]); 

    return (
        <div className='py-16 lg:px-10 flex flex-col gap-10'>
            <h1 className='text-center font-semibold text-4xl text-[#4096D3]'>
                เที่ยวไหนดี
            </h1>

            <div className='px-10 lg:px-40'>
                <div className='py-2 flex flex-col gap-2 border-b border-[#C0C0C0]'>
                    <label>ค้นหาที่เที่ยว</label>
                    <input
                        type="text"
                        placeholder='หาที่เที่ยวแล้วไปกัน ...'
                        value={searchTrip}
                        onChange={(e) => { setSearchTrip(e.target.value) }}
                        className='outline-none border-none placeholder:text-center text-center'
                    />
                </div>
            </div>

            <div >
                {trips.length > 0 ? (
                    <ul className='px-10 lg:px-20 flex flex-col gap-10'>
                        {trips.map(trip => (
                            <li key={trip.id} className='flex flex-col lg:flex-row gap-10'>

                                <div className='lg:w-1/4'>
                                   <img 
                                        src={trip.photos[0]} 
                                        alt={`ภาพที่ ${trip.id} ของ ${trip.title}`}
                                        className='rounded-lg object-cover'
                                    />
                                </div>

                                <div className='flex flex-col gap-2 lg:w-3/4'>
                                    <a 
                                        href={trip.url} 
                                        target='blank'
                                        className='font-semibold text-2xl hover:underline'>
                                            {trip.title}
                                    </a>

                                    <p className='text-gray-500'>
                                        {expandedTripId === trip.eid ? trip.description : `${trip.description.substring(0, 100)}...`}
                                    </p>

                                    <button 
                                        onClick={() => handleClickReadMore(trip.eid)} 
                                        className='text-blue-700 underline hover:text-red-400 w-20 text-left'>
                                        {expandedTripId === trip.eid ? "อ่านน้อยลง" : "อ่านต่อ"}
                                    </button>

                                    <div className='flex gap-4 text-sm lg:text-base'>
                                        หมวดหมู่ : 
                                        {trip.tags.map((tag,index) => (
                                            <button 
                                                key={index} 
                                                className='underline hover:text-blue-500'
                                                value={tag}
                                                onClick={handleTagClick}
                                                >
                                                    {tag}
                                            </button>
                                        ))}
                                    </div>

                                    <div className='flex  justify-between items-center'>
                                        <div className='flex gap-6'>
                                            <img 
                                                src={trip.photos[1]} 
                                                alt={`ภาพของ ${trip.title}`}
                                                className='size-14 lg:size-20 rounded-lg object-cover' 
                                            />

                                            <img 
                                                src={trip.photos[2]} 
                                                alt={`ภาพของ ${trip.title}`}
                                                className='size-14 lg:size-20  rounded-lg object-cover' 
                                            />

                                            <img 
                                                src={trip.photos[1]} 
                                                alt={`ภาพของ ${trip.title}`}
                                                className='size-14 lg:size-20  rounded-lg object-cover' 
                                            />
                                        </div>

                                        <div className='relative'>
                                            <Link 
                                                className='bg-white text-blue-500 size-12 rounded-full p-2 
                                                    border-2 border-blue-500 hover:text-white hover:bg-blue-500 hover:border-white
                                                    cursor-pointer'
                                                onClick={() => handleCopy(trip.url,trip.eid)}
                                                    />
                                            {copyId === trip.eid && (
                                                <div className='absolute py-3 px-8 left-[-35px] bg-green-500 text-white mt-2 rounded-lg'>
                                                    Copied
                                                </div>
                                            )}
                                        </div>
                                        
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>ไม่พบการค้นหา</p>
                )}
            </div>
        </div>
    );
}

export default Homepage;
