import React, { useState, useEffect, useRef } from 'react';

function PhotoGallery(props) {
    const [photos, setPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [loading, setLoading] = useState(true);
    const [visiblePhotos, setVisiblePhotos] = useState(new Set());
    const photoRefs = useRef({});

    useEffect(() => {
        // Get list of all gallery files
        const photoList = [
            { filename: 'Hospital_Part_1/20251031_105035389.jpg' },
            { filename: 'Hospital_Part_1/20251031_105035389.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_105144053.jpg' },
            { filename: 'Hospital_Part_1/20251031_105144053.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_105337772.jpg' },
            { filename: 'Hospital_Part_1/20251031_105337772.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_105846754.jpg' },
            { filename: 'Hospital_Part_1/20251031_105846754.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_110212861.jpg' },
            { filename: 'Hospital_Part_1/20251031_110212861.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_110414009.jpg' },
            { filename: 'Hospital_Part_1/20251031_110414009.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_110520935.jpg' },
            { filename: 'Hospital_Part_1/20251031_110520935.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_110813258.jpg' },
            { filename: 'Hospital_Part_1/20251031_110813258.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_111140900.jpg' },
            { filename: 'Hospital_Part_1/20251031_111140900.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_111621308.jpg' },
            { filename: 'Hospital_Part_1/20251031_111621308.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_112152649.jpg' },
            { filename: 'Hospital_Part_1/20251031_112152649.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_112401751.jpg' },
            { filename: 'Hospital_Part_1/20251031_112401751.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_112751864.jpg' },
            { filename: 'Hospital_Part_1/20251031_112751864.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_113028742.jpg' },
            { filename: 'Hospital_Part_1/20251031_113028742.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_113338577.jpg' },
            { filename: 'Hospital_Part_1/20251031_113338577.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_113531979.jpg' },
            { filename: 'Hospital_Part_1/20251031_113531979.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_113753932.jpg' },
            { filename: 'Hospital_Part_1/20251031_113753932.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_114004973.jpg' },
            { filename: 'Hospital_Part_1/20251031_114004973.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_114735170.jpg' },
            { filename: 'Hospital_Part_1/20251031_114735170.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_114819705.jpg' },
            { filename: 'Hospital_Part_1/20251031_114819705.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_115051379.jpg' },
            { filename: 'Hospital_Part_1/20251031_115051379.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_115219636.jpg' },
            { filename: 'Hospital_Part_1/20251031_115219636.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_115439513.jpg' },
            { filename: 'Hospital_Part_1/20251031_115439513.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_115716322.jpg' },
            { filename: 'Hospital_Part_1/20251031_115716322.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_120120297.jpg' },
            { filename: 'Hospital_Part_1/20251031_120120297.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_120407037.jpg' },
            { filename: 'Hospital_Part_1/20251031_120407037.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_120720108.jpg' },
            { filename: 'Hospital_Part_1/20251031_120720108.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_121011269.jpg' },
            { filename: 'Hospital_Part_1/20251031_121011269.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_121454743.jpg' },
            { filename: 'Hospital_Part_1/20251031_121454743.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_121530135.jpg' },
            { filename: 'Hospital_Part_1/20251031_121530135.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_121856827.jpg' },
            { filename: 'Hospital_Part_1/20251031_121856827.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_122201207.jpg' },
            { filename: 'Hospital_Part_1/20251031_122201207.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_122430463.jpg' },
            { filename: 'Hospital_Part_1/20251031_122430463.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_122541013.jpg' },
            { filename: 'Hospital_Part_1/20251031_122541013.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_122858459.jpg' },
            { filename: 'Hospital_Part_1/20251031_122858459.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_123050286.jpg' },
            { filename: 'Hospital_Part_1/20251031_123050286.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_123333884.jpg' },
            { filename: 'Hospital_Part_1/20251031_123333884.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_123648507.jpg' },
            { filename: 'Hospital_Part_1/20251031_123648507.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_123846992.jpg' },
            { filename: 'Hospital_Part_1/20251031_123846992.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_124104947.jpg' },
            { filename: 'Hospital_Part_1/20251031_124104947.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_124320852.jpg' },
            { filename: 'Hospital_Part_1/20251031_124320852.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_124519400.jpg' },
            { filename: 'Hospital_Part_1/20251031_124519400.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_124755261.jpg' },
            { filename: 'Hospital_Part_1/20251031_124755261.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_124950998.jpg' },
            { filename: 'Hospital_Part_1/20251031_124950998.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_125146221.jpg' },
            { filename: 'Hospital_Part_1/20251031_125146221.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_125917496.jpg' },
            { filename: 'Hospital_Part_1/20251031_125917496.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_130320913.jpg' },
            { filename: 'Hospital_Part_1/20251031_130320913.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_130723659.jpg' },
            { filename: 'Hospital_Part_1/20251031_130723659.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_131133472.jpg' },
            { filename: 'Hospital_Part_1/20251031_131133472.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_131337626.jpg' },
            { filename: 'Hospital_Part_1/20251031_131337626.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_131536469.jpg' },
            { filename: 'Hospital_Part_1/20251031_131536469.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_131921084.jpg' },
            { filename: 'Hospital_Part_1/20251031_131921084.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_132158543.jpg' },
            { filename: 'Hospital_Part_1/20251031_132158543.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_132451421.jpg' },
            { filename: 'Hospital_Part_1/20251031_132451421.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_132522303.jpg' },
            { filename: 'Hospital_Part_1/20251031_132522303.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_132723963.jpg' },
            { filename: 'Hospital_Part_1/20251031_132723963.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_132901565.jpg' },
            { filename: 'Hospital_Part_1/20251031_132901565.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_134309714.jpg' },
            { filename: 'Hospital_Part_1/20251031_134309714.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_134539619.jpg' },
            { filename: 'Hospital_Part_1/20251031_134539619.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_134701070.jpg' },
            { filename: 'Hospital_Part_1/20251031_134701070.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_135122099.jpg' },
            { filename: 'Hospital_Part_1/20251031_135122099.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_140006100.jpg' },
            { filename: 'Hospital_Part_1/20251031_140006100.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_140208783.jpg' },
            { filename: 'Hospital_Part_1/20251031_140208783.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_140342342.jpg' },
            { filename: 'Hospital_Part_1/20251031_140342342.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_140544557.jpg' },
            { filename: 'Hospital_Part_1/20251031_140544557.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_140921474.jpg' },
            { filename: 'Hospital_Part_1/20251031_140921474.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_141209912.jpg' },
            { filename: 'Hospital_Part_1/20251031_141209912.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_141525531.jpg' },
            { filename: 'Hospital_Part_1/20251031_141525531.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_141937380.jpg' },
            { filename: 'Hospital_Part_1/20251031_141937380.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_142205837.jpg' },
            { filename: 'Hospital_Part_1/20251031_142205837.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_142305823.jpg' },
            { filename: 'Hospital_Part_1/20251031_142305823.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_142611375.jpg' },
            { filename: 'Hospital_Part_1/20251031_142611375.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_142915448.jpg' },
            { filename: 'Hospital_Part_1/20251031_142915448.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_143110605.jpg' },
            { filename: 'Hospital_Part_1/20251031_143110605.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_143301538.jpg' },
            { filename: 'Hospital_Part_1/20251031_143301538.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_143332941.jpg' },
            { filename: 'Hospital_Part_1/20251031_143332941.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_143454903.jpg' },
            { filename: 'Hospital_Part_1/20251031_143454903.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_143539106.jpg' },
            { filename: 'Hospital_Part_1/20251031_143539106.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_143651882.jpg' },
            { filename: 'Hospital_Part_1/20251031_143651882.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_143951346.jpg' },
            { filename: 'Hospital_Part_1/20251031_143951346.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_144216954.jpg' },
            { filename: 'Hospital_Part_1/20251031_144216954.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_144419940.jpg' },
            { filename: 'Hospital_Part_1/20251031_144419940.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_144630056.jpg' },
            { filename: 'Hospital_Part_1/20251031_144630056.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_144827429.jpg' },
            { filename: 'Hospital_Part_1/20251031_144827429.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_144929330.jpg' },
            { filename: 'Hospital_Part_1/20251031_144929330.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_145015818.jpg' },
            { filename: 'Hospital_Part_1/20251031_145015818.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_145151361.jpg' },
            { filename: 'Hospital_Part_1/20251031_145151361.mp4', isVideo: true },
            { filename: 'Hospital_Part_1/20251031_145505381.jpg' },
            { filename: 'Hospital_Part_1/20251031_145505381.mp4', isVideo: true },
            { filename: 'Hospital_Part_2/20251031_103044730.jpg' },
            { filename: 'Hospital_Part_2/20251031_103044730.mp4', isVideo: true },
            { filename: 'Hospital_Part_2/20251031_103238433.jpg' },
            { filename: 'Hospital_Part_2/20251031_103238433.mp4', isVideo: true },
            { filename: 'Hospital_Part_2/20251031_103615002.jpg' },
            { filename: 'Hospital_Part_2/20251031_103615002.mp4', isVideo: true },
            { filename: 'Hospital_Part_2/20251031_103658013.jpg' },
            { filename: 'Hospital_Part_2/20251031_103658013.mp4', isVideo: true },
            { filename: 'Hospital_Part_2/20251031_104011453.jpg' },
            { filename: 'Hospital_Part_2/20251031_104011453.mp4', isVideo: true },
            { filename: 'Hospital_Part_2/20251031_104130276.jpg' },
            { filename: 'Hospital_Part_2/20251031_104130276.mp4', isVideo: true },
            { filename: 'Hospital_Part_2/20251031_104544663.jpg' },
            { filename: 'Hospital_Part_2/20251031_104544663.mp4', isVideo: true },
            { filename: 'Hospital_Part_2/20251031_104820868.jpg' },
            { filename: 'Hospital_Part_2/20251031_104820868.mp4', isVideo: true }
        ];

        // Reverse so last photos appear first
        const reversedList = [...photoList].reverse();
        
        const loadedPhotos = reversedList.map((photo, index) => {
            const fileExtension = photo.filename.split('.').pop().toLowerCase();
            const isVideo = photo.isVideo || ['mp4', 'webm', 'mov'].includes(fileExtension);
            
            return {
                id: index + 1,
                url: `/swabnseq/gallery/${photo.filename}`,
                isVideo: isVideo
            };
        });

        setPhotos(loadedPhotos);
        setLoading(false);
        
        // Pre-load first 12 photos immediately
        const initialVisible = new Set(loadedPhotos.slice(0, 12).map(p => p.id.toString()));
        setVisiblePhotos(initialVisible);
    }, []);

    // Lazy loading with Intersection Observer
    useEffect(() => {
        if (photos.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '100px',
            threshold: 0.01
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const photoId = entry.target.dataset.photoId;
                    setVisiblePhotos(prev => new Set([...prev, photoId]));
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        Object.values(photoRefs.current).forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => {
            Object.values(photoRefs.current).forEach(ref => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [photos]);

    const openModal = (photo) => {
        const index = photos.findIndex(p => p.id === photo.id);
        setSelectedPhoto(photo);
        setSelectedIndex(index);
    };

    const closeModal = () => {
        setSelectedPhoto(null);
        setSelectedIndex(-1);
    };

    const goToPrevious = (e) => {
        if (e) e.stopPropagation();
        if (selectedIndex > 0) {
            const newIndex = selectedIndex - 1;
            setSelectedPhoto(photos[newIndex]);
            setSelectedIndex(newIndex);
        } else {
            const newIndex = photos.length - 1;
            setSelectedPhoto(photos[newIndex]);
            setSelectedIndex(newIndex);
        }
    };

    const goToNext = (e) => {
        if (e) e.stopPropagation();
        if (selectedIndex < photos.length - 1) {
            const newIndex = selectedIndex + 1;
            setSelectedPhoto(photos[newIndex]);
            setSelectedIndex(newIndex);
        } else {
            setSelectedPhoto(photos[0]);
            setSelectedIndex(0);
        }
    };

    useEffect(() => {
        if (!selectedPhoto) return;

        const handleKeyPress = (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const newIndex = selectedIndex > 0 ? selectedIndex - 1 : photos.length - 1;
                setSelectedPhoto(photos[newIndex]);
                setSelectedIndex(newIndex);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const newIndex = selectedIndex < photos.length - 1 ? selectedIndex + 1 : 0;
                setSelectedPhoto(photos[newIndex]);
                setSelectedIndex(newIndex);
            } else if (e.key === 'Escape') {
                closeModal();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selectedPhoto, selectedIndex, photos]);

    if (loading) {
        return (
            <div>
                <h1 className={'text-align-center'}>Photo Gallery</h1>
                <div className={'padding-top-20'}>
                    <p style={{ textAlign: 'center' }}>Loading photos...</p>
                </div>
            </div>
        );
    }

    if (photos.length === 0) {
        return (
            <div>
                <h1 className={'text-align-center'}>Photo Gallery</h1>
                <div className={'padding-top-20'}>
                    <p style={{ textAlign: 'center' }}>No photos available</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
            <h1 className={'text-align-center'}>Photo Gallery</h1>
            <div className={'padding-top-20'}>
                <p style={{ textAlign: 'center', marginBottom: '30px' }}>
                    Explore photos and videos from the IGO Swab 'n Seq 2025 Open House event
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
                padding: '20px 0'
            }}>
                {photos.map((photo) => {
                    const isVisible = visiblePhotos.has(photo.id.toString());
                    const shouldLoad = isVisible || photo.id <= 12;

                    return (
                        <div
                            key={photo.id}
                            ref={el => photoRefs.current[photo.id] = el}
                            data-photo-id={photo.id}
                            onClick={() => openModal(photo)}
                            style={{
                                cursor: 'pointer',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                backgroundColor: '#fff',
                                minHeight: '250px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                            }}
                        >
                            {shouldLoad ? (
                                photo.isVideo ? (
                                    <video
                                        src={photo.url}
                                        style={{
                                            width: '100%',
                                            height: '250px',
                                            objectFit: 'cover',
                                            display: 'block'
                                        }}
                                        muted
                                        preload="metadata"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<div style="width:100%;height:250px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;color:#999;">Video not found</div>';
                                        }}
                                    />
                                ) : (
                                    <img
                                        src={photo.url}
                                        alt="Gallery image"
                                        loading="lazy"
                                        decoding="async"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                                        }}
                                        style={{
                                            width: '100%',
                                            height: '250px',
                                            objectFit: 'cover',
                                            display: 'block',
                                            transition: 'opacity 0.3s'
                                        }}
                                        onLoad={(e) => {
                                            e.target.style.opacity = '1';
                                        }}
                                    />
                                )
                            ) : (
                                <div style={{
                                    width: '100%',
                                    height: '250px',
                                    backgroundColor: '#f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#999'
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{
                                            width: '30px',
                                            height: '30px',
                                            border: '3px solid #ddd',
                                            borderTop: '3px solid #666',
                                            borderRadius: '50%',
                                            animation: 'spin 0.8s linear infinite',
                                            margin: '0 auto'
                                        }}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {selectedPhoto && (
                <div
                    onClick={closeModal}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        cursor: 'pointer',
                        padding: '20px'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: '90%',
                            maxHeight: '90%',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <button
                            onClick={goToPrevious}
                            style={{
                                position: 'absolute',
                                left: '-60px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                color: 'white',
                                fontSize: '32px',
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background 0.2s',
                                zIndex: 1001
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                            }}
                        >
                            ‹
                        </button>

                        <button
                            onClick={goToNext}
                            style={{
                                position: 'absolute',
                                right: '-60px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                color: 'white',
                                fontSize: '32px',
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background 0.2s',
                                zIndex: 1001
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                            }}
                        >
                            ›
                        </button>

                        {selectedPhoto.isVideo ? (
                            <video
                                src={selectedPhoto.url}
                                controls
                                autoPlay
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '80vh',
                                    borderRadius: '8px'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<div style="color:white;text-align:center;padding:40px;">Video not found</div>';
                                }}
                            />
                        ) : (
                            <img
                                src={selectedPhoto.url}
                                alt="Gallery image"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                                }}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '80vh',
                                    objectFit: 'contain',
                                    borderRadius: '8px'
                                }}
                            />
                        )}

                        <button
                            onClick={closeModal}
                            style={{
                                position: 'absolute',
                                top: '-40px',
                                right: '0',
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                color: 'white',
                                fontSize: '24px',
                                width: '35px',
                                height: '35px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                            }}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PhotoGallery;
