<?php
namespace Grav\Plugin\Console;

use Grav\Console\ConsoleCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

/**
 * Class LogCommand
 *
 * @package Grav\Plugin\Console
 */
class LogCommand extends ConsoleCommand
{
    /**
     * @var string
     */
    protected $logfile;
    /**
     * @var array
     */
    protected $options = [];
    /**
     * @var array
     */
    protected $colors = [
        'DEBUG'     => 'green',
        'INFO'      => 'cyan',
        'NOTICE'    => 'yellow',
        'WARNING'   => 'yellow',
        'ERROR'     => 'red',
        'CRITICAL'  => 'red',
        'ALERT'     => 'red',
        'EMERGENCY' => 'magenta'
    ];

    /**
     *
     */
    protected function configure()
    {
        $this->logfile = LOG_DIR . 'grav.log';
        $this
            ->setName("log")
            ->setDescription("Outputs the Error Log")
            ->addOption(
                'trace',
                't',
                InputOption::VALUE_NONE,
                'Include the errors stack trace in the output'
            )
            ->addOption(
                'limit',
                'l',
                InputArgument::OPTIONAL,
                'Outputs only the last X amount of errors. Use as --limit 10 / -l 10 [default 5]',
                5
            )
            ->setHelp('The <info>log</info> outputs the Errors Log in Console')
        ;
    }

    /**
     * @return int|null|void
     */
    protected function serve()
    {
        $this->options = [
            'trace' => $this->input->getOption('trace'),
            'limit' => $this->input->getOption('limit')
        ];

        if (!file_exists($this->logfile)) {
            $this->output->writeln("\n" . "Log file not found." . "\n");
            exit;
        }

        $log   = file_get_contents($this->logfile);
        $lines = explode("\n", $log);

        if (!is_numeric($this->options['limit'])) {
            $this->options['limit'] = 5;
        }

        $lines = array_slice($lines, -($this->options['limit'] + 1));

        foreach ($lines as $line) {
            $this->output->writeln($this->parseLine($line));
        }
    }

    /**
     * @param $line
     *
     * @return null|string
     */
    protected function parseLine($line)
    {
        $bit   = explode(': ', $line);
        $line1 = explode('] ', $bit[0]);

        if (!$line1[0]) {
            return null;
        }

        $line2 = explode(' - ', $bit[1]);

        $date  = $line1[0] . ']';
        $type  = str_replace('grav.', '', $line1[1]);
        $color = $this->colors[$type];
        $error = $line2[0];
        $trace = implode(': ', array_slice($bit, 2));

        $output = [];

        $output[] = '';
        $output[] = '<cyan>' . $date . '</cyan>';
        $output[] = sprintf('  <%s>%s</%s> <white>' . $error . '</white>', $color, $type, $color);

        if ($this->options['trace']) {
            $output[] = '  <white>TRACE:</white> ';
            $output[] = '  ' . $trace;
        }

        $output[] = '<cyan>' . str_repeat('-', strlen($date)) . '</cyan>';

        return implode("\n", $output);
    }
}

