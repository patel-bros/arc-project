from django.core.management.base import BaseCommand
from core.utils import initialize_trading_pairs, simulate_all_prices
from core.models import TradingPair
import time

class Command(BaseCommand):
    help = 'Initialize crypto trading system and start price simulation'

    def add_arguments(self, parser):
        parser.add_argument(
            '--simulate',
            action='store_true',
            help='Start continuous price simulation',
        )
        parser.add_argument(
            '--interval',
            type=int,
            default=30,
            help='Price update interval in seconds (default: 30)',
        )

    def handle(self, *args, **options):
        self.stdout.write('Initializing ARC Crypto Trading System...')
        
        # Initialize trading pairs
        try:
            initialize_trading_pairs()
            self.stdout.write(
                self.style.SUCCESS('✓ Trading pairs initialized successfully')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'✗ Failed to initialize trading pairs: {e}')
            )
            return
        
        # Run initial price simulation
        try:
            simulate_all_prices()
            self.stdout.write(
                self.style.SUCCESS('✓ Initial price simulation completed')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'✗ Failed to simulate prices: {e}')
            )
            return
        
        # Display initialized pairs
        pairs = TradingPair.objects(is_active=True)
        self.stdout.write('\n📊 Active Trading Pairs:')
        for pair in pairs:
            self.stdout.write(
                f'  {pair.pair}: ${pair.current_price:.8f} '
                f'({pair.price_change_24h:+.2f}%)'
            )
        
        if options['simulate']:
            self.stdout.write(
                f'\n🔄 Starting continuous price simulation '
                f'(interval: {options["interval"]}s)'
            )
            self.stdout.write('Press Ctrl+C to stop...\n')
            
            try:
                while True:
                    time.sleep(options['interval'])
                    updated_prices = simulate_all_prices()
                    
                    self.stdout.write(f'🔄 Price update at {time.strftime("%H:%M:%S")}:')
                    for pair_name, data in updated_prices.items():
                        change_symbol = '+' if data['change_24h'] >= 0 else ''
                        self.stdout.write(
                            f'  {pair_name}: ${data["price"]:.8f} '
                            f'({change_symbol}{data["change_24h"]:.2f}%)'
                        )
                    self.stdout.write('')
                    
            except KeyboardInterrupt:
                self.stdout.write('\n⏹️  Price simulation stopped')
        
        self.stdout.write(
            self.style.SUCCESS('\n✅ ARC Crypto System initialization complete!')
        )
