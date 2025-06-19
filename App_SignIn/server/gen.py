import csv 
import datetime 
import random 
import os 
import numpy as np 
import matplotlib.pyplot as plt 
import weakref

def gen_date():
    start = datetime.datetime.strptime("2014-01-22", "%Y-%m-%d")
    end = datetime.datetime.strptime("2015-01-22","%Y-%m-%d")

    date_generated = [ 
        {
            'date' : f'{(start + datetime.timedelta(days=x)):%Y-%m-%d}' ,
            'value' : random.normalvariate(100, 10) ,
        }
        for x in range(0, ( end-start).days + 1)]

    with open(os.path.join(os.getcwd(), 'bigdata', 'gen2.csv') , mode="w", newline="" ) as file:
        writer = csv.DictWriter(file, fieldnames=['date', 'value'])
        writer.writeheader()
        writer.writerows(date_generated)


def signal_tone(mode = 1):
    """
        create a tone which shifts in frequency
    """

    if mode == 1:
        """
            Known:

                Capture Time (T) ( controls resolution )
                
                Number of Samples (N)

        """

        N = 2048 

        T = 1 # sec

        ts = T / N 

        fs = 1 / ts 

        fo = 2
        
        n = np.arange(N)
        
        y = np.exp( 1j * 2 * np.pi * fo * n * ts )

        f_y = np.fft.fft(y)
        f_x = n * (fs/N)
        
        ax1 = plt.subplot(2,1,1)
        ax1.plot( n * ts, y)
        
        ax2 = plt.subplot(2,1,2)
        ax2.plot(f_x, f_y)

        plt.show()
    
    elif mode == 2:
        """
            Known:

                Sample Frequency (fs)
                
                Number of Samples (N)
        """

        N = 2048 

        n = np.arange(N)

        fo = 2 # cycle per seocnd

        ts = fo / N  #  cycle per second / num of samples
        
        fs = 1 / ts 

        ts_n = n * ts

        y = np.exp( 1j * 2 * np.pi * fo * n * ts )


        f_y = np.fft.fft(y)
        f_x = n * (fs/N)
        
        ax1 = plt.subplot(2,1,1)
        ax1.plot( n * ts, y)
        
        ax2 = plt.subplot(2,1,2)
        ax2.plot(f_x, f_y)

        plt.show()

    elif mode == 3:

        """
            Known:

                Signal observation frequency (fo)

                Sampling frequency (fs)

                Observation Time (T)

        """

        fo = 2  # cycles per second

        fs = 8  # samples per second

        ts = 1 / fs 

        T = 2 

        plt.ion() 
        plt.show()
        fig = plt.figure() 

        for T in np.arange(2, 22, 2):
            N = T / ts 
            n = np.arange(N)

            y = np.exp( 1j * 2 * np.pi * fo * n * ts )

            f_x = n * (fs/N)
            f_y = np.fft.fft(y)
            f_y_mag = np.abs(f_y)
            f_y_norm = f_y_mag/ np.max( f_y_mag) 
            
            ax1 = fig.add_subplot(2,1,1)
            ax1.plot( n * ts, y)
            
            ax2 = fig.add_subplot(2,1,2)
            ax2.plot(f_x, f_y )
            ax2.set_xlim(0, fs)
            
            # data = (list(zip(f_x.round(4).tolist(), f_y_norm.round( 4).tolist())) )
            
            data = [ {'data': data, 'value': value} for  data, value in zip(f_x.round(4), f_y_norm.round( 4)) ] 

            print(data[0:20])

            plt.pause(0.5)
            
            plt.suptitle(f'{T * fo} cycles')
            
            wl1 = weakref.ref(ax1)
            wl2 = weakref.ref(ax2)

            ax1.remove()
            ax2.remove()

            del wl1
            del wl2

            with open(os.path.join(os.getcwd(), 'bigdata', 'tones', f'wave{T}.csv') , mode="w", newline="" ) as file:
                writer = csv.DictWriter(file, fieldnames=['data', 'value'])
                writer.writeheader()
                writer.writerows(data)

    elif mode == 4:
        
        """

            sin wave
        
        """

        N = 2048 

        T = 1 # sec

        ts = T / N 

        fs = 1 / ts 

        fo = 900
        
        n = np.arange(N)
        
        n_ts = n * ts
        
        y_noise =  0.7*np.random.uniform(0,1 , N) 
        y_noise =  0.002 * np.random.normal(0, 4, N)

        y = (np.exp( 1j * 2 * np.pi * fo * n * ts ))  + y_noise
        y_mag = np.abs(y)


        f_x = n * (fs/N)
        f_y = np.fft.fft(y)
        f_y_mag = np.abs(f_y)
        f_y_norm = f_y_mag/ np.max( f_y_mag) 

        plt.plot(n, y_mag)
        plt.show()

        
        data = [ {'time': time, 'amplitude': amplitude} for  time, amplitude in zip(n, y_mag.round(3) ) ] 

        with open(os.path.join(os.getcwd(), 'bigdata', 'tones', f'sinraw.csv') , mode="w", newline="" ) as file:
            writer = csv.DictWriter(file, fieldnames=['time', 'amplitude'])
            writer.writeheader()
            writer.writerows(data)
        
        data = [ {'frequency': freqdata, 'normalized': normdata} for freqdata, normdata in zip(f_x.round(3), f_y_norm.round( 3)) ]
        with open(os.path.join(os.getcwd(), 'bigdata', 'tones', f'sinfft.csv') , mode="w", newline="" ) as file:
            writer = csv.DictWriter(file, fieldnames=['frequency', 'normalized'])
            writer.writeheader()
            writer.writerows(data)

    elif mode == 5:
            
            """

                sweep signal
            
            """
            
            num_waves = 30; 
            N = 2048 
            steps = np.floor(N/num_waves)
            dataTimeX = np.zeros(shape=(N * num_waves))
            dataTimeY = np.zeros(shape=(N * num_waves))

            dataFFTX = np.zeros(shape=(N * num_waves))
            dataFFTY = np.zeros(shape=(N * num_waves))

            i = 0
            # .linspace(0, 2048, 2048)
            for fo in  np.arange(0, num_waves ) :


                T = 1 # sec

                ts = T / N 

                fs = 1 / ts 

                # fo = 900
                n = np.arange(N)
                
                n_ts = n * ts
                
                y_noise =  0.7*np.random.uniform(0,1 , N) 
                y_noise =   0.1* np.random.normal(0, 1, N)

                y =  (0.1 if fo == 0 else 0.6) * (np.exp( 1j * 2 * np.pi * fo * 68 * n * ts ))  + y_noise + 1
                y_mag = np.abs(y)


                f_x = n * (fs/N)
                f_y = np.fft.fft(y)
                f_y_mag = np.abs(f_y)
                f_y_norm = f_y_mag/ np.max( f_y_mag) 

                # plt.plot(f_x, f_y_norm)
                # plt.show()
                
                # plt.plot(n, y)
                # plt.show()
                
                dataTimeX[i * N : N * (i+1)] =  n
                dataTimeY[i * N : N * (i+1)] =  y
                
                dataFFTX[i * N : N * (i+1)] =  f_x
                dataFFTY[i * N : N * (i+1)] =  f_y_norm

                data_time = [ {'time': t, 'amplitude': a} for  t, a in zip(dataTimeX, dataTimeY.round(3) ) ] 
                
                data_spectrum = [ {'frequency': f, 'magnitude': a} for  f, a in zip(dataFFTX, dataFFTY.round(3) ) ] 
                i += 1
                # data = [ {'time': time, 'amplitude': amplitude} for  time, amplitude in zip(n, y_mag.round(3) ) ] 

            with open(os.path.join(os.getcwd(), 'bigdata', 'tones', f'time.csv') , mode="w", newline="" ) as file:
                writer = csv.DictWriter(file, fieldnames=['time', 'amplitude'])
                writer.writeheader()
                writer.writerows(data_time)
            
            # data = [ {'frequency': freqdata, 'normalized': normdata} for freqdata, normdata in zip(f_x.round(3), f_y_norm.round( 3)) ]
            with open(os.path.join(os.getcwd(), 'bigdata', 'tones', f'spectrum.csv') , mode="w", newline="" ) as file:
                writer = csv.DictWriter(file, fieldnames=['frequency', 'magnitude'])
                writer.writeheader()
                writer.writerows(data_spectrum)


if __name__ == "__main__":
    signal_tone(5)